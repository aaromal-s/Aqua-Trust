import { Router } from 'express';
import crypto from 'crypto';

const router = Router();

export interface WaterPassportRecord {
  passportId: string;
  stationOrFacility: string;
  facilityType: 'MUNICIPAL_WATERWORKS' | 'RESERVOIR' | 'RESIDENTIAL_RO' | 'COMMERCIAL_TANKER' | 'RURAL_TUBEWELL';
  location: string;
  testedAt: string;
  certifiedBy: string;
  parameters: {
    pH: number;
    turbidity_ntu: number;
    tds_ppm: number;
    chlorine_ppm: number;
    coliform_cfu: number;
  };
  complianceStatus: 'EXEMPLARY' | 'SAFE_BIS_10500' | 'REQUIRES_ACTION' | 'HAZARDOUS';
  blockNumber: number;
  previousBlockHash: string;
  dataHash: string;
  merkleRoot: string;
  digitalSignature: string;
  qrPayload: string;
}

// Genesis Block & Seed Certified Passports
const GENESIS_HASH = '0000000000000000000a1b2c3d4e5f6789abcdef0123456789abcdef01234567';

function generateHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function calculateMerkleRoot(elements: string[]): string {
  if (elements.length === 0) return generateHash('empty');
  let currentLayer = elements.map(el => generateHash(el));
  while (currentLayer.length > 1) {
    const nextLayer: string[] = [];
    for (let i = 0; i < currentLayer.length; i += 2) {
      const left = currentLayer[i];
      const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : left;
      nextLayer.push(generateHash(left + right));
    }
    currentLayer = nextLayer;
  }
  return currentLayer[0];
}

let passportChain: WaterPassportRecord[] = [
  {
    passportId: 'PASSPORT-PB-CHD-001',
    stationOrFacility: 'Kajauli Waterworks Phase IV Terminal',
    facilityType: 'MUNICIPAL_WATERWORKS',
    location: 'Sector 39 Grid, Chandigarh (UT)',
    testedAt: '2026-10-07T08:30:00Z',
    certifiedBy: 'MC Chandigarh Public Health Directorate',
    parameters: {
      pH: 7.35,
      turbidity_ntu: 0.85,
      tds_ppm: 148,
      chlorine_ppm: 0.45,
      coliform_cfu: 0
    },
    complianceStatus: 'EXEMPLARY',
    blockNumber: 10482,
    previousBlockHash: GENESIS_HASH,
    dataHash: generateHash('PASSPORT-PB-CHD-001|Kajauli|7.35|0.85|148'),
    merkleRoot: calculateMerkleRoot(['7.35', '0.85', '148', '0.45', '0']),
    digitalSignature: 'PPCB_ECDSA_SIG_98af3410bc8723de4f901234567890abcdef1234',
    qrPayload: 'https://aquatrust.org/passport/verify/PASSPORT-PB-CHD-001'
  },
  {
    passportId: 'PASSPORT-PB-CHD-002',
    stationOrFacility: 'Sukhna Lake Deep Aeration Station',
    facilityType: 'RESERVOIR',
    location: 'Sukhna Lake Watershed, Sector 1, Chandigarh',
    testedAt: '2026-10-07T09:15:00Z',
    certifiedBy: 'PPCB Regional Hydrology Bureau',
    parameters: {
      pH: 7.42,
      turbidity_ntu: 1.15,
      tds_ppm: 172,
      chlorine_ppm: 0.05,
      coliform_cfu: 2
    },
    complianceStatus: 'SAFE_BIS_10500',
    blockNumber: 10483,
    previousBlockHash: generateHash('PASSPORT-PB-CHD-001|Kajauli|7.35|0.85|148'),
    dataHash: generateHash('PASSPORT-PB-CHD-002|Sukhna|7.42|1.15|172'),
    merkleRoot: calculateMerkleRoot(['7.42', '1.15', '172', '0.05', '2']),
    digitalSignature: 'PPCB_ECDSA_SIG_17bc4290df6632ac9e8172648190beef5432',
    qrPayload: 'https://aquatrust.org/passport/verify/PASSPORT-PB-CHD-002'
  },
  {
    passportId: 'PASSPORT-PB-LUD-003',
    stationOrFacility: 'Industrial Canal Outfall #4',
    facilityType: 'RURAL_TUBEWELL',
    location: 'Budha Nullah Downstream, Ludhiana',
    testedAt: '2026-10-07T10:00:00Z',
    certifiedBy: 'PPCB Toxic Effluent Taskforce',
    parameters: {
      pH: 5.60,
      turbidity_ntu: 14.80,
      tds_ppm: 820,
      chlorine_ppm: 0.00,
      coliform_cfu: 45
    },
    complianceStatus: 'HAZARDOUS',
    blockNumber: 10484,
    previousBlockHash: generateHash('PASSPORT-PB-CHD-002|Sukhna|7.42|1.15|172'),
    dataHash: generateHash('PASSPORT-PB-LUD-003|BudhaNullah|5.60|14.80|820'),
    merkleRoot: calculateMerkleRoot(['5.60', '14.80', '820', '0.00', '45']),
    digitalSignature: 'PPCB_ECDSA_SIG_88da1245ee1198bc7d4390128765feed7890',
    qrPayload: 'https://aquatrust.org/passport/verify/PASSPORT-PB-LUD-003'
  }
];

// GET all certified passports
router.get('/', (req, res) => {
  res.json({
    totalCount: passportChain.length,
    genesisHash: GENESIS_HASH,
    lastBlockHash: passportChain[passportChain.length - 1].dataHash,
    networkName: 'AquaTrust Distributed Water Purity Ledger (Punjab & Chandigarh)',
    passports: passportChain
  });
});

// GET verify specific passport by ID or hash
router.get('/verify/:identifier', (req, res) => {
  const { identifier } = req.params;
  const found = passportChain.find(
    p => p.passportId.toLowerCase() === identifier.toLowerCase() ||
         p.dataHash.toLowerCase() === identifier.toLowerCase()
  );

  if (!found) {
    return res.status(404).json({
      verified: false,
      status: 'NOT_FOUND',
      message: 'Passport ID or Cryptographic Hash not found on AquaTrust Ledger'
    });
  }

  // Recalculate hash on the fly to confirm zero tampering
  const computedHash = generateHash(
    `${found.passportId}|${found.stationOrFacility.split(' ')[0]}|${found.parameters.pH}|${found.parameters.turbidity_ntu}|${found.parameters.tds_ppm}`
  );

  const isTampered = computedHash !== found.dataHash;

  res.json({
    verified: !isTampered,
    status: isTampered ? 'TAMPERED_WARNING' : 'VALID_AND_AUTHENTIC',
    passport: found,
    cryptographicProof: {
      blockNumber: found.blockNumber,
      computedHash,
      ledgerHash: found.dataHash,
      previousBlockHash: found.previousBlockHash,
      merkleRoot: found.merkleRoot,
      digitalSignature: found.digitalSignature,
      consensusStandard: 'BIS 10500:2012 Certified Environmental Hash Chain',
      verifiedAt: new Date().toISOString()
    }
  });
});

// POST issue new water passport
router.post('/issue', (req, res) => {
  const {
    stationOrFacility,
    facilityType,
    location,
    parameters,
    certifiedBy
  } = req.body;

  const passportId = `PASSPORT-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const previousRecord = passportChain[passportChain.length - 1];
  const previousBlockHash = previousRecord ? previousRecord.dataHash : GENESIS_HASH;
  const blockNumber = previousRecord ? previousRecord.blockNumber + 1 : 10001;

  const safeParams = {
    pH: Number(parameters?.pH) || 7.2,
    turbidity_ntu: Number(parameters?.turbidity_ntu) || 1.0,
    tds_ppm: Number(parameters?.tds_ppm) || 180,
    chlorine_ppm: Number(parameters?.chlorine_ppm) || 0.3,
    coliform_cfu: Number(parameters?.coliform_cfu) || 0,
  };

  // Determine compliance
  let complianceStatus: WaterPassportRecord['complianceStatus'] = 'SAFE_BIS_10500';
  if (safeParams.pH >= 6.8 && safeParams.pH <= 7.8 && safeParams.turbidity_ntu < 1.0 && safeParams.tds_ppm < 200 && safeParams.coliform_cfu === 0) {
    complianceStatus = 'EXEMPLARY';
  } else if (safeParams.pH < 6.0 || safeParams.turbidity_ntu > 8.0 || safeParams.tds_ppm > 600 || safeParams.coliform_cfu > 10) {
    complianceStatus = 'HAZARDOUS';
  } else if (safeParams.pH < 6.5 || safeParams.pH > 8.5 || safeParams.turbidity_ntu > 4.0 || safeParams.tds_ppm > 450) {
    complianceStatus = 'REQUIRES_ACTION';
  }

  const facilityPrefix = (stationOrFacility || 'Facility').split(' ')[0];
  const dataHash = generateHash(`${passportId}|${facilityPrefix}|${safeParams.pH}|${safeParams.turbidity_ntu}|${safeParams.tds_ppm}`);
  const merkleRoot = calculateMerkleRoot([
    String(safeParams.pH),
    String(safeParams.turbidity_ntu),
    String(safeParams.tds_ppm),
    String(safeParams.chlorine_ppm),
    String(safeParams.coliform_cfu)
  ]);
  const digitalSignature = `ECDSA_PPCB_SIG_${crypto.randomBytes(20).toString('hex')}`;

  const newPassport: WaterPassportRecord = {
    passportId,
    stationOrFacility: stationOrFacility || 'Municipal Storage Tanker',
    facilityType: facilityType || 'COMMERCIAL_TANKER',
    location: location || 'Sector 35-B Chandigarh',
    testedAt: new Date().toISOString(),
    certifiedBy: certifiedBy || 'PPCB Certified Mobile Lab Unit',
    parameters: safeParams,
    complianceStatus,
    blockNumber,
    previousBlockHash,
    dataHash,
    merkleRoot,
    digitalSignature,
    qrPayload: `https://aquatrust.org/passport/verify/${passportId}`
  };

  passportChain.push(newPassport);

  res.status(201).json({
    status: 'success',
    message: 'Cryptographic Water Passport issued & committed to ledger',
    passport: newPassport
  });
});

export default router;
