/**
 * RSVP handler — receives POST from the wedding site
 * and appends a row to the "RSVP" sheet.
 *
 * SETUP:
 *   1. Create a Google Sheet with a tab named "RSVP"
 *   2. Add headers in Row 1: Fecha | Nombre | Asistencia
 *   3. Open Extensions → Apps Script
 *   4. Paste this entire file
 *   5. Deploy → New deployment → Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   6. Copy the deployment URL
 */

// ── Config ──────────────────────────────────────────────────────────────────
var SHEET_NAME = "RSVP";
var NOTIFY_EMAIL = "sergioymerilyn@gmail.com";
var SEND_EMAIL = true;   // set to false to disable email notifications

// ── POST handler ────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var nombre = data.nombre || "";
    var asistencia = data.asistencia || "";
    var fecha = new Date();

    // Append row
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    sheet.appendRow([fecha, nombre, asistencia]);

    // Optional email notification
    if (SEND_EMAIL && NOTIFY_EMAIL) {
      var subject = nombre + " — " + asistencia;
      var body = "Nueva confirmación de asistencia\n"
        + "================================\n\n"
        + "Nombre:     " + nombre + "\n"
        + "Asistencia: " + asistencia + "\n"
        + "Fecha:      " + fecha.toLocaleString("es-GT") + "\n";
      MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
