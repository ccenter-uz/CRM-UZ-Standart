import { Link } from "@/navigation";
import { Icon, Text, Tooltip } from "@chakra-ui/react";
import { PenTool } from "react-feather";
import { scssVariables } from "../utils/vars";

export const callcenterColumns = [
  {
    title: "№",
    key: "index",
    dataIndex: "index",
    width: 50,
    align: "center",
  },
  {
    title: "",
    dataIndex: "change",
    key: "change",
    align: "center",
    render: (t: any, record: any) => (
      <Link href={`/callcenter/leaveRequest?edit=${record.id}`}>
        <Tooltip label="Тахрирлаш">
          <Icon as={PenTool} color={scssVariables.primary}>
            Тахрирлаш
          </Icon>
        </Tooltip>
      </Link>
    ),
  },
  {
    title: "Мурожаат холати",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Мурожаат рақами",
    dataIndex: "incoming_number",
    key: "incoming_number",
    render: (t: any, record: any) => (
      <Link href={`/callcenter/${record.id}`}>
        <Text color={"#2675c7"} _hover={{ opacity: 0.8 }}>
          {t}
        </Text>
      </Link>
    ),
  },
  {
    title: "Мурожатчи",
    dataIndex: "applicant",
    key: "applicant",
  },
  {
    title: "Туғиланган сана",
    dataIndex: "applicant_birthday",
    key: "applicant_birthday",
  },
  {
    title: "Телефон рақами",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "МФЙ-ҚФЙ",
    dataIndex: "mfy",
    key: "mfy",
  },
  {
    title: "Кўча ва уй",
    dataIndex: "street_and_apartment",
    key: "street_and_apartment",
  },
  {
    title: "Вилоят",
    dataIndex: "region",
    key: "region",
    render: (t: string, record: any) => {
      return record.districts?.region?.title;
    },
  },
  {
    title: "Туман",
    dataIndex: "district",
    key: "district",
    render: (t: string, record: any) => {
      return record.districts?.title;
    },
  },
  {
    title: "Келиб тушган вақти",
    dataIndex: "income_date",
    key: "income_date",
    align: "center",
  },
  {
    title: "Юридик / Жисмоний шахс",
    dataIndex: "organization_type",
    key: "organization_type",
    align: "center",
  },

  {
    title: "Мурожаат тури",
    dataIndex: "application_type",
    key: "application_type",
    align: "center",
  },
  {
    title: "Тасниф",
    dataIndex: "sub_category_call_center",
    key: "sub_category_call_center",
    render: (t: any) => t?.title,
  },
  {
    title: "Мурожаатнинг қисқача мазмуни",
    dataIndex: "comment",
    key: "comment",
    align: "center",
    render: (t: string) => {
      return (
        <Tooltip label={t}>
          <Text>{t.length > 20 ? t.slice(0, 20) + "..." : t}</Text>
        </Tooltip>
      );
    },
  },
  {
    title: "Янги мурожаат ёки Такрорий мурожаатлар",
    dataIndex: "resend_application",
    key: "resend_application",
    align: "center",
  },
  {
    title: "Ижрочи",
    dataIndex: "performer",
    key: "performer",
    render: (t: string, record: any) => {
      return record?.performer?.title;
    },
  },
  {
    title: "Ижро қилинган сана",
    dataIndex: "perform_date",
    key: "perform_date",
    align: "center",
  },
  {
    title: "Рахбарият",
    dataIndex: "executer",
    key: "executer",
    align: "center",
    render: (t: string, record: any) => {
      return record?.executer?.title;
    },
  },
  {
    title: "Мурожаатни жавоби",
    dataIndex: "response",
    key: "response",
    align: "center",
    render: (t: string) => {
      return t === "null" ? "" : t;
    },
  },
];
