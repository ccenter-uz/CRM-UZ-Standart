import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

export const getcallcenterforExcel = async (columns: any, data: any) => {
  try {
    const headers = columns
      .filter((col: any) => col.title !== "")
      .map((col: any) => col.title);

    const worksheetData = [
      headers,
      ...data.map((item: any) => [
        item.index,
        item.incoming_number,
        item?.applicant,
        item?.applicant_birthday
          ? dayjs(item?.applicant_birthday).format("DD.MM.YYYY")
          : "маълумот йўқ",
        item?.phone,
        item?.mfy,
        item?.street_and_apartment,
        item?.districts?.region?.title,
        item?.districts?.title,
        item?.income_date
          ? dayjs(item?.income_date).format("DD.MM.YYYY HH:mm")
          : "маълумот йўқ",
        item?.organization_type,
        item?.application_type,
        item?.sub_category_call_center?.category_org?.title,
        item?.sub_category_call_center?.title,
        item?.comment,
        item?.resend_application,
        item?.operator_number,
        item?.performer,
        item?.perform_date
          ? dayjs(item?.perform_date).format("DD.MM.YYYY HH:mm")
          : "маълумот йўқ",
        item?.seded_to_Organization?.title,
        item?.response,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "Мурожаатлар(Колл-марказ).xlsx");
  } catch (err) {
    console.error(err);
  }
};
