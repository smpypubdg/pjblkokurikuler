/**
 * Portal PjBL Kokurikuler SMP YPU Bandung - Apps Script Web App Server
 * Author: @ihsanmsyahid
 * Description: Serves the index.html Web App and provides backend API endpoints for Google Sheets sync.
 */

// Global Configuration
const APP_TITLE = "Portal PjBL Kokurikuler SMP YPU Bandung";
const FAVICON_URL = "https://i.ibb.co.com/8gMSjY4F/IMG-20251203-114653.png";

/**
 * doGet - Handles HTTP GET requests to serve the single-file HTML Web App
 * @param {Object} e - HTTP GET Request parameters
 * @return {HtmlOutput} Evaluated HTML Output
 */
function doGet(e) {
  try {
    const template = HtmlService.createTemplateFromFile('index');
    const htmlOutput = template.evaluate()
      .setTitle(APP_TITLE)
      .setFaviconUrl(FAVICON_URL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    
    return htmlOutput;
  } catch (err) {
    return HtmlService.createHtmlOutput('<h3>Error loading Portal PjBL: ' + err.toString() + '</h3>');
  }
}

/**
 * doPost - Handles HTTP POST requests for saving data to Google Sheets (Optional Cloud Backup)
 * @param {Object} e - HTTP POST Request parameters
 * @return {TextOutput} JSON Response
 */
function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;
    let result = { success: false, message: "Unknown action" };

    if (action === "syncPresensi") {
      result = logPresensiToSheet(contents.data);
    } else if (action === "syncJurnal") {
      result = logJurnalToSheet(contents.data);
    } else if (action === "syncLKPD") {
      result = logLkpdToSheet(contents.data);
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Gets or creates a specific worksheet tab in the active spreadsheet
 * @param {String} sheetName - Name of the worksheet tab
 * @param {Array} headers - Array of column header strings
 * @return {Sheet} Google Sheet instance
 */
function getOrCreateSheet(sheetName, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight("bold")
        .setBackground("#0f172a")
        .setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

/**
 * Logs Presensi attendance records into Google Sheets
 */
function logPresensiToSheet(data) {
  const headers = ["Timestamp", "Nama Kelompok", "Tanggal Kegiatan", "Nama Siswa", "Status Kehadiran", "Catatan"];
  const sheet = getOrCreateSheet("Log_Presensi", headers);
  const now = new Date();

  if (data && data.records && Array.isArray(data.records)) {
    data.records.forEach(function(rec) {
      sheet.appendRow([
        now,
        data.groupName || "-",
        data.date || "-",
        rec.name || "-",
        rec.status || "-",
        rec.note || "-"
      ]);
    });
    return { success: true, message: "Presensi saved to Google Sheet." };
  }
  return { success: false, message: "Invalid presensi payload." };
}

/**
 * Logs Jurnal entries into Google Sheets
 */
function logJurnalToSheet(data) {
  const headers = ["Timestamp", "Nama Kelompok", "Tanggal", "Jam Mulai", "Jam Selesai", "Pemateri", "Ringkasan / Resume"];
  const sheet = getOrCreateSheet("Log_Jurnal", headers);
  
  sheet.appendRow([
    new Date(),
    data.groupName || "-",
    data.date || "-",
    data.timeStart || "-",
    data.timeEnd || "-",
    data.pemateri || "-",
    data.summary || "-"
  ]);
  return { success: true, message: "Jurnal saved to Google Sheet." };
}

/**
 * Logs LKPD submissions metadata into Google Sheets
 */
function logLkpdToSheet(data) {
  const headers = ["Timestamp", "Nama Kelompok", "LKPD Ke", "Topik / Judul", "Pemateri", "Tanggal", "Jumlah Foto Dok", "Jumlah Foto LKPD"];
  const sheet = getOrCreateSheet("Log_LKPD", headers);

  sheet.appendRow([
    new Date(),
    data.groupName || "-",
    data.no || "-",
    data.title || "-",
    data.pemateri || "-",
    data.date || "-",
    data.docFilesCount || 0,
    data.workFilesCount || 0
  ]);
  return { success: true, message: "LKPD record saved to Google Sheet." };
}

/**
 * Helper function to include HTML/CSS/JS file chunks into the main template
 * Usage in index.html: <?!= include('FileName'); ?>
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
