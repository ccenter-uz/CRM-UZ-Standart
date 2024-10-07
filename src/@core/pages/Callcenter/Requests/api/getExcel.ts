import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

export const getcallcenterforExcel = async (columns: any, data: any) => {
  try {
    const exceptions = ["mfy", "gender", "applicant_birthday"];
    const headers = columns
      .filter(
        (col: any) => col.title !== "" && !exceptions.includes(col.dataIndex)
      )
      .map((col: any) => col.title);

    const worksheetData = [
      headers,
      ...data.map((item: any) => [
        item?.index,
        item?.response_file,
        item?.status,
        item?.incoming_number,
        item?.applicant,
        item?.phone,
        item?.email,
        item?.street_and_apartment,
        item?.districts?.region?.title,
        item?.districts?.title,
        item?.income_date || "маълумот йўқ",
        item?.organization_type === "null"
          ? "маълумот йўқ"
          : item?.organization_type,
        item?.application_type,
        item?.sub_category_call_center?.title,
        item?.comment,
        item?.resend_application === "null"
          ? "маълумот йўқ"
          : item?.resend_application,
        item?.performers?.title,
        item?.perform_date || "маълумот йўқ",
        item?.seded_to_Organization?.title,
        item?.response === "null" ? "маълумот йўқ" : item?.response,
        item?.response_story,
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
