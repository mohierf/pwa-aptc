import moment from "moment-timezone";

export function toApiDate(myDate) {
  let answerDate = myDate.tz("Europe/Paris");
  answerDate.tz("UTC");
  return answerDate.format("YYYY-MM-DD HH:mm:ss");
}

export function fromApiDate(apiDate, format = null) {
  let receiptDate = moment(apiDate).tz("Europe/Paris");
  if (format) {
    receiptDate = receiptDate.format(format);
  }
  return receiptDate;
}
