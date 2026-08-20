const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const ALL_STUDENTS_MASTER = [
  { name: 'Abiyan Akbar Caisar Nurfattah', kelas: 'VII-B', group: 'Cakravarti 1', jk: 'L' },
  { name: 'Adi Wistara', kelas: 'VIII-A', group: 'Ghananta 1', jk: 'L' },
  { name: 'Aditya Asmawi Yana', kelas: 'VIII-A', group: 'Bramanta 1', jk: 'L' },
  { name: 'Aditya Saputra', kelas: 'IX-A', group: 'Cakravarti 1', jk: 'L' },
  { name: 'Ahmad Maulana', kelas: 'VII-A', group: 'Hiranya 1', jk: 'L' },
  { name: 'Aira Putri Maharani', kelas: 'VII-A', group: 'Cakravarti 2', jk: 'P' },
  { name: 'Aisha Hanes Afitdaeni', kelas: 'VII-B', group: 'Dirandra 2', jk: 'P' },
  { name: 'Albiansyah Hidayat', kelas: 'IX-A', group: 'Arunika 1', jk: 'L' },
  { name: 'Aliya Febriyanti', kelas: 'VIII-A', group: 'Elysia 2', jk: 'P' },
  { name: 'Alsya Nazma Novita', kelas: 'IX-B', group: 'Cakravarti 2', jk: 'P' },
  { name: 'Angelica Putri', kelas: 'VII-A', group: 'Bramanta 2', jk: 'P' },
  { name: 'Anisa Putri Fauziah', kelas: 'IX-B', group: 'Arunika 2', jk: 'P' },
  { name: 'Annisa Safaria Nur Jannah', kelas: 'VII-B', group: 'Arunika 2', jk: 'P' },
  { name: 'Apriliani', kelas: 'VII-A', group: 'Cakravarti 2', jk: 'P' },
  { name: 'Aqila Maharani', kelas: 'VII-B', group: 'Falana 2', jk: 'P' },
  { name: 'Aqilla Putri Oktavia', kelas: 'VII-B', group: 'Indivar 2', jk: 'P' },
  { name: 'Aqiysya Bilqis Nur Agnetta', kelas: 'VII-B', group: 'Falana 2', jk: 'P' },
  { name: 'Ardan Fauzy Pratama', kelas: 'VII-B', group: 'Hiranya 1', jk: 'L' },
  { name: 'Arif Aditya Latif', kelas: 'IX-B', group: 'Bramanta 1', jk: 'L' },
  { name: 'Arina Rahmawati', kelas: 'IX-A', group: 'Hiranya 2', jk: 'P' },
  { name: 'Arya Nugraha', kelas: 'IX-B', group: 'Elysia 1', jk: 'L' },
  { name: 'Aryanti Dwi Anggraeni', kelas: 'IX-A', group: 'Bramanta 2', jk: 'P' },
  { name: 'Aska', kelas: 'VII-B', group: 'Dirandra 1', jk: 'L' },
  { name: 'Asri Tri Wahyuni', kelas: 'VII-B', group: 'Bramanta 2', jk: 'P' },
  { name: 'Ayu Aulia Shinta', kelas: 'VIII-A', group: 'Dirandra 2', jk: 'P' },
  { name: 'Azahra Tri Lestari', kelas: 'VII-A', group: 'Indivar 2', jk: 'P' },
  { name: 'Azda Ananda Khoerunnisa', kelas: 'VII-A', group: 'Dirandra 2', jk: 'P' },
  { name: 'Azka Aldric Wiguna', kelas: 'VII-A', group: 'Jayananda 1', jk: 'L' },
  { name: 'Berlian Bushaynah Putri K.', kelas: 'IX-B', group: 'Jayananda 2', jk: 'P' },
  { name: 'Brayen Aditya Pratama', kelas: 'VIII-A', group: 'Arunika 1', jk: 'L' },
  { name: 'Cahaya Ananda Tri Evita', kelas: 'IX-B', group: 'Hiranya 2', jk: 'P' },
  { name: 'Defa Raffiandra Ginanjar', kelas: 'VII-A', group: 'Dirandra 1', jk: 'L' },
  { name: 'Delia Nur Azizah', kelas: 'IX-B', group: 'Dirandra 2', jk: 'P' },
  { name: 'Destri Zaumi Ananda', kelas: 'IX-A', group: 'Indivar 2', jk: 'P' },
  { name: 'Dexel Gabriel', kelas: 'VIII-A', group: 'Jayananda 1', jk: 'L' },
  { name: 'Dezhar Zhibral Idris', kelas: 'VIII-A', group: 'Falana 1', jk: 'L' },
  { name: 'Dhika Pratama', kelas: 'VII-A', group: 'Cakravarti 1', jk: 'L' },
  { name: 'Didan Khoirul Ramadhan', kelas: 'IX-B', group: 'Dirandra 1', jk: 'L' },
  { name: 'Dika Arjun Saputra', kelas: 'IX-A', group: 'Jayananda 1', jk: 'L' },
  { name: 'Dika Hermawan', kelas: 'VII-B', group: 'Ghananta 1', jk: 'L' },
  { name: 'Elang Surya Prasetya', kelas: 'VIII-A', group: 'Cakravarti 1', jk: 'L' },
  { name: 'Fanny Anggraeny', kelas: 'VIII-A', group: 'Falana 2', jk: 'P' },
  { name: 'Farid Alfa Rizky', kelas: 'VII-A', group: 'Arunika 1', jk: 'L' },
  { name: 'Fatir Muhammad Azka', kelas: 'VII-A', group: 'Indivar 1', jk: 'L' },
  { name: 'Fauzan Ciryll Ibrahim', kelas: 'VIII-A', group: 'Elysia 1', jk: 'L' },
  { name: 'Fawaz Ghaly Mughist Mukhlis', kelas: 'IX-B', group: 'Indivar 1', jk: 'L' },
  { name: 'Felice Andini Gumilar', kelas: 'VIII-A', group: 'Bramanta 2', jk: 'P' },
  { name: 'Fika Friciliani', kelas: 'VIII-A', group: 'Hiranya 2', jk: 'P' },
  { name: 'Gabriel Catur Purnama', kelas: 'VII-A', group: 'Falana 1', jk: 'L' },
  { name: 'Ibams Arsyalo', kelas: 'IX-B', group: 'Arunika 1', jk: 'L' },
  { name: 'Ilyas Zaki', kelas: 'IX-A', group: 'Dirandra 1', jk: 'L' },
  { name: 'Intan Kharisma', kelas: 'VII-B', group: 'Arunika 2', jk: 'P' },
  { name: 'Ismail Dwi Andhika', kelas: 'VIII-A', group: 'Indivar 1', jk: 'L' },
  { name: 'Johan Permana', kelas: 'IX-B', group: 'Indivar 1', jk: 'L' },
  { name: 'Kania Aiysah', kelas: 'IX-B', group: 'Jayananda 2', jk: 'P' },
  { name: 'Kanzza Dwi Lestari', kelas: 'VII-A', group: 'Hiranya 2', jk: 'P' },
  { name: 'Kartika Susandi', kelas: 'IX-B', group: 'Indivar 2', jk: 'P' },
  { name: 'Keyla Amora Reppie', kelas: 'IX-A', group: 'Ghananta 2', jk: 'P' },
  { name: 'Khoerul Fahry Bashary', kelas: 'VII-B', group: 'Bramanta 1', jk: 'L' },
  { name: 'M. Arya Duta Wijaya', kelas: 'VIII-A', group: 'Falana 1', jk: 'L' },
  { name: 'Mei Syah Nugrah Amelia', kelas: 'IX-A', group: 'Arunika 2', jk: 'P' },
  { name: 'Milzan Ibrahim Movic', kelas: 'IX-A', group: 'Ghananta 1', jk: 'L' },
  { name: 'Mira Nurfadilah', kelas: 'VIII-A', group: 'Cakravarti 2', jk: 'P' },
  { name: 'Muhamad Farhan Algivari', kelas: 'VIII-A', group: 'Dirandra 1', jk: 'L' },
  { name: 'Muhamad Najran Saputra', kelas: 'VIII-A', group: 'Indivar 1', jk: 'L' },
  { name: 'Muhamad Najrin Saputra', kelas: 'IX-B', group: 'Hiranya 1', jk: 'L' },
  { name: 'Muhamad Noval Ardian', kelas: 'IX-A', group: 'Jayananda 1', jk: 'L' },
  { name: 'Muhammad Bilal Maulana', kelas: 'VII-B', group: 'Jayananda 1', jk: 'L' },
  { name: 'Muhammad Dandi', kelas: 'IX-A', group: 'Cakravarti 1', jk: 'L' },
  { name: 'Muhammad Iqbal Nur Hafizh', kelas: 'VII-B', group: 'Elysia 1', jk: 'L' },
  { name: 'Nakeila Syakirah Zahra', kelas: 'VII-A', group: 'Elysia 2', jk: 'P' },
  { name: 'Nasya Nur Afni', kelas: 'IX-A', group: 'Ghananta 2', jk: 'P' },
  { name: 'Naurra Fadhilla Idris', kelas: 'IX-A', group: 'Indivar 2', jk: 'P' },
  { name: 'Naysyira Nurhadiani', kelas: 'IX-B', group: 'Arunika 2', jk: 'P' },
  { name: 'Nicholas Novicky Sandy', kelas: 'IX-A', group: 'Hiranya 1', jk: 'L' },
  { name: 'Nizam M. Rozak Fadilah', kelas: 'IX-B', group: 'Hiranya 1', jk: 'L' },
  { name: 'Novandra Raihan Putra', kelas: 'VIII-A', group: 'Jayananda 1', jk: 'L' },
  { name: 'Novia Angelia', kelas: 'IX-B', group: 'Ghananta 2', jk: 'P' },
  { name: 'Nurhalimah', kelas: 'IX-A', group: 'Dirandra 2', jk: 'P' },
  { name: 'Prama Pramuadji Sidik', kelas: 'VII-B', group: 'Arunika 1', jk: 'L' },
  { name: 'Princess Anindya Purnama', kelas: 'IX-B', group: 'Dirandra 2', jk: 'P' },
  { name: 'Putri Suci Lestari', kelas: 'VII-A', group: 'Ghananta 2', jk: 'P' },
  { name: 'Rani Aprilyanti', kelas: 'VII-A', group: 'Ghananta 2', jk: 'P' },
  { name: 'Rava Aprilian', kelas: 'VIII-A', group: 'Arunika 1', jk: 'L' },
  { name: 'Rayyan Ziqri', kelas: 'VII-B', group: 'Falana 1', jk: 'L' },
  { name: 'Reski Ditiya Putra', kelas: 'VII-A', group: 'Ghananta 1', jk: 'L' },
  { name: 'Reva Lestari', kelas: 'VII-B', group: 'Hiranya 2', jk: 'P' },
  { name: 'Rifqy Rivanka Faisal', kelas: 'IX-A', group: 'Ghananta 1', jk: 'L' },
  { name: 'Rivaldhy Ramadhan Putra', kelas: 'VIII-A', group: 'Elysia 1', jk: 'L' },
  { name: 'Rizha Putra Pratama', kelas: 'VIII-A', group: 'Bramanta 1', jk: 'L' },
  { name: 'Rizqiya Azila Putri', kelas: 'VII-B', group: 'Elysia 2', jk: 'P' },
  { name: 'Rizqy Avrilian Nugraha', kelas: 'IX-A', group: 'Falana 1', jk: 'L' },
  { name: 'Roro Defara Rohmania Hasyari', kelas: 'VIII-A', group: 'Cakravarti 2', jk: 'P' },
  { name: 'Rustandi Dzulkarnaen', kelas: 'VII-B', group: 'Indivar 1', jk: 'L' },
  { name: 'Safa Mutiara Safira', kelas: 'IX-B', group: 'Falana 2', jk: 'P' },
  { name: 'Safa Putri Maharani', kelas: 'IX-A', group: 'Elysia 2', jk: 'P' },
  { name: 'Safengi Listiana Suhada', kelas: 'VIII-A', group: 'Jayananda 2', jk: 'P' },
  { name: 'Salsabila Azahra', kelas: 'IX-B', group: 'Elysia 2', jk: 'P' },
  { name: 'Satria Ramadhani', kelas: 'VII-A', group: 'Elysia 1', jk: 'L' },
  { name: 'Sintia Septiani', kelas: 'IX-B', group: 'Jayananda 2', jk: 'P' },
  { name: 'Siti Nurlela', kelas: 'VIII-A', group: 'Ghananta 2', jk: 'P' },
  { name: 'Suci Fatharani Putri', kelas: 'IX-A', group: 'Bramanta 2', jk: 'P' },
  { name: 'Sultan November A.P.', kelas: 'VII-A', group: 'Bramanta 1', jk: 'L' },
  { name: 'Syaqilah Roffi Yulianti', kelas: 'VII-A', group: 'Jayananda 2', jk: 'P' },
  { name: 'Vera Indah Lestari', kelas: 'IX-A', group: 'Hiranya 2', jk: 'P' },
  { name: 'Violina Angel', kelas: 'IX-B', group: 'Falana 2', jk: 'P' }
];

const getInitialGroupData = () => {
  const groupsMap = {};
  const rawGroupNames = Array.from(new Set(ALL_STUDENTS_MASTER.map(s => s.group))).sort();

  rawGroupNames.forEach((gName, idx) => {
    const groupId = `kel-${idx + 1}`;
    const groupStudents = ALL_STUDENTS_MASTER.filter(s => s.group === gName).map((item, index) => ({
      id: index + 1,
      name: item.name,
      kelas: item.kelas,
      jk: item.jk || 'L',
      nis: `2024${String(index + 1).padStart(2, '0')}`,
      role: 'Anggota',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(item.name)}`
    }));

    groupsMap[groupId] = {
      id: groupId,
      name: `Kelompok ${gName}`,
      rawGroup: gName,
      code: (1001 + idx).toString(),
      isStructureLocked: false,
      members: groupStudents,
      presensiList: [],
      lkpdList: [],
      jurnalList: []
    };
  });

  return groupsMap;
};

const loadDatabase = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading database file, creating fresh dataset:", err);
  }
  const freshDb = { groups: getInitialGroupData(), updatedAt: Date.now() };
  saveDatabase(freshDb);
  return freshDb;
};

const saveDatabase = (data) => {
  try {
    data.updatedAt = Date.now();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Error saving to database file:", err);
  }
};

let db = loadDatabase();


// Authentication API
app.post('/api/auth/login', (req, res) => {
  try {
    const { role, username, password } = req.body;
    const userClean = (username || '').trim().toLowerCase();
    const passClean = (password || '').trim();

    if (role === 'admin') {
      if (userClean === 'administrator' && passClean === 'leadershipcamp') {
        const token = crypto.randomBytes(16).toString('hex');
        return res.json({
          success: true,
          token,
          role: 'admin',
          message: 'Berhasil masuk sebagai Administrator Portal!'
        });
      }
      return res.status(401).json({ success: false, message: 'Username atau Password Administrator tidak valid.' });
    }

    // Group Authentication
    const groupList = Object.values(db.groups);
    let matchedGroup = null;

    for (const g of groupList) {
      const cred = g.rawGroup.toLowerCase().replace(/\s+/g, '_');
      let alias = null;
      if (cred.startsWith('dirandra_')) {
        alias = cred.replace('dirandra_', 'dinandra_');
      }

      if ((userClean === cred && passClean === cred) || (alias && userClean === alias && passClean === alias)) {
        matchedGroup = g;
        break;
      }
    }

    if (matchedGroup) {
      const token = crypto.randomBytes(16).toString('hex');
      return res.json({
        success: true,
        token,
        role: 'group',
        group: matchedGroup,
        message: `Berhasil masuk sebagai ${matchedGroup.name}`
      });
    }

    return res.status(401).json({ success: false, message: 'Username atau Password kelompok tidak cocok.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.toString() });
  }
});


// Fetch All Groups State
app.get('/api/groups', (req, res) => {
  res.json({ success: true, groups: Object.values(db.groups) });
});

// Fetch Single Group State
app.get('/api/groups/:groupId', (req, res) => {
  const { groupId } = req.params;
  const group = db.groups[groupId];
  if (!group) {
    return res.status(404).json({ success: false, message: 'Kelompok tidak ditemukan.' });
  }
  res.json({ success: true, group });
});

// Lock and Save Group Structure
app.post('/api/groups/:groupId/struktur', (req, res) => {
  try {
    const { groupId } = req.params;
    const { members } = req.body;

    const group = db.groups[groupId];
    if (!group) {
      return res.status(404).json({ success: false, message: 'Kelompok tidak ditemukan.' });
    }

    if (group.isStructureLocked) {
      return res.status(403).json({ success: false, message: 'Struktur kelompok sudah terkunci permanen dan tidak dapat diubah lagi.' });
    }

    group.members = members;
    group.isStructureLocked = true;
    saveDatabase(db);

    res.json({ success: true, message: 'Struktur kelompok berhasil dikunci permanen!', group });
  } catch (err) {
    res.status(500).json({ success: false, error: err.toString() });
  }
});


// Add or Update Daily Attendance
app.post('/api/presensi/:groupId', (req, res) => {
  try {
    const { groupId } = req.params;
    const { date, records } = req.body;

    const group = db.groups[groupId];
    if (!group) {
      return res.status(404).json({ success: false, message: 'Kelompok tidak ditemukan.' });
    }

    const existingIndex = group.presensiList.findIndex(p => p.date === date);
    if (existingIndex >= 0) {
      group.presensiList[existingIndex].records = records;
    } else {
      group.presensiList.unshift({
        id: `pres-${Date.now()}`,
        date,
        records
      });
    }

    saveDatabase(db);
    res.json({ success: true, message: `Presensi tanggal ${date} berhasil disimpan!`, presensiList: group.presensiList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.toString() });
  }
});


// Upload LKPD Submission
app.post('/api/lkpd/:groupId', (req, res) => {
  try {
    const { groupId } = req.params;
    const { no, title, pemateri, date, docFiles, workFiles, notes } = req.body;

    const group = db.groups[groupId];
    if (!group) {
      return res.status(404).json({ success: false, message: 'Kelompok tidak ditemukan.' });
    }

    const newEntry = {
      id: `lkpd-${Date.now()}`,
      no: parseInt(no, 10) || group.lkpdList.length + 1,
      title: (title || '').trim(),
      pemateri: (pemateri || '').trim(),
      date,
      docFiles: docFiles || [],
      workFiles: workFiles || [],
      status: 'Terverifikasi',
      notes: (notes || '').trim() || 'Sudah dilengkapi.'
    };

    group.lkpdList.unshift(newEntry);
    saveDatabase(db);

    res.json({ success: true, message: `LKPD ke-${newEntry.no} berhasil diunggah!`, lkpdList: group.lkpdList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.toString() });
  }
});

// Delete Individual LKPD File
app.delete('/api/lkpd/:groupId/:lkpdId/file', (req, res) => {
  try {
    const { groupId, lkpdId } = req.params;
    const { category, fileIndex } = req.body; // category: 'docFiles' | 'workFiles'

    const group = db.groups[groupId];
    if (!group) {
      return res.status(404).json({ success: false, message: 'Kelompok tidak ditemukan.' });
    }

    const lkpd = group.lkpdList.find(item => item.id === lkpdId);
    if (!lkpd || !lkpd[category]) {
      return res.status(404).json({ success: false, message: 'Berkas LKPD tidak ditemukan.' });
    }

    lkpd[category].splice(fileIndex, 1);
    saveDatabase(db);

    res.json({ success: true, message: 'Berkas foto berhasil dihapus!', lkpd });
  } catch (err) {
    res.status(500).json({ success: false, error: err.toString() });
  }
});

// Delete Complete LKPD Entry
app.delete('/api/lkpd/:groupId/:lkpdId', (req, res) => {
  try {
    const { groupId, lkpdId } = req.params;
    const group = db.groups[groupId];
    if (!group) {
      return res.status(404).json({ success: false, message: 'Kelompok tidak ditemukan.' });
    }

    group.lkpdList = group.lkpdList.filter(item => item.id !== lkpdId);
    saveDatabase(db);

    res.json({ success: true, message: 'LKPD berhasil dihapus.', lkpdList: group.lkpdList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.toString() });
  }
});


// Add Journal Entry
app.post('/api/jurnal/:groupId', (req, res) => {
  try {
    const { groupId } = req.params;
    const { date, timeStart, timeEnd, pemateri, summary } = req.body;

    const group = db.groups[groupId];
    if (!group) {
      return res.status(404).json({ success: false, message: 'Kelompok tidak ditemukan.' });
    }

    const newObj = {
      id: `j-${Date.now()}`,
      date,
      timeStart,
      timeEnd,
      pemateri: (pemateri || '').trim(),
      summary: (summary || '').trim()
    };

    group.jurnalList.unshift(newObj);
    saveDatabase(db);

    res.json({ success: true, message: 'Catatan Jurnal Kegiatan berhasil disimpan!', jurnalList: group.jurnalList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.toString() });
  }
});

// Delete Journal Entry
app.delete('/api/jurnal/:groupId/:jurnalId', (req, res) => {
  try {
    const { groupId, jurnalId } = req.params;
    const group = db.groups[groupId];
    if (!group) {
      return res.status(404).json({ success: false, message: 'Kelompok tidak ditemukan.' });
    }

    group.jurnalList = group.jurnalList.filter(j => j.id !== jurnalId);
    saveDatabase(db);

    res.json({ success: true, message: 'Catatan jurnal berhasil dihapus.', jurnalList: group.jurnalList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.toString() });
  }
});


// Global Dashboard Metrics & Visualizations
app.get('/api/admin/dashboard-stats', (req, res) => {
  try {
    const allGroups = Object.values(db.groups);
    let totalStudents = 0;
    let totalLkpdUploaded = 0;
    let totalJurnalEntries = 0;

    const attendanceRecap = allGroups.map(d => {
      totalStudents += d.members.length;
      totalLkpdUploaded += d.lkpdList.length;
      totalJurnalEntries += d.jurnalList.length;

      let totalHadir = 0, totalSakit = 0, totalIzin = 0, totalAlfa = 0, totalDispensasi = 0;
      const totalSessions = d.presensiList.length;

      d.presensiList.forEach(p => {
        if (p.records) {
          p.records.forEach(r => {
            if (r.status === 'Hadir') totalHadir++;
            else if (r.status === 'Sakit') totalSakit++;
            else if (r.status === 'Izin') totalIzin++;
            else if (r.status === 'Alfa') totalAlfa++;
            else if (r.status === 'Dispensasi') totalDispensasi++;
          });
        }
      });

      const totalPossible = (d.members.length * totalSessions) || 1;
      const rate = Math.round((totalHadir / totalPossible) * 100);

      return {
        groupId: d.id,
        groupName: d.name,
        rawGroup: d.rawGroup,
        studentCount: d.members.length,
        sessionCount: totalSessions,
        totalHadir,
        totalSakit,
        totalIzin,
        totalAlfa,
        totalDispensasi,
        rate
      };
    });

    res.json({
      success: true,
      stats: {
        totalGroups: allGroups.length,
        totalStudents,
        totalLkpdUploaded,
        totalJurnalEntries
      },
      attendanceRecap
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Portal PjBL Kokurikuler SMP YPU Bandung - REST API`);
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log(`Database storage file: ${DB_FILE}`);
  console.log(`====================================================`);
});