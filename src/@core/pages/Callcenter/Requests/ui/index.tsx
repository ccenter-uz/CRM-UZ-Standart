"use client";
import { scssVariables } from "@/@core/application/utils/vars";
import { usePagination } from "@/@core/shared/hook/usePaginate";
import BreadCrumb from "@/@core/shared/ui/Breadcrumb";
import Pagination from "@/@core/shared/ui/Pagination";
import { PaperContent } from "@/@core/shared/ui/PaperContent";
import TableGen from "@/@core/shared/ui/Table";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { useGlobal } from "@/@core/application/store/global";
import { useRouter, useSearchParams } from "next/navigation";
import { useRequest } from "../model/Slicer";
import { getcallcenterforExcel } from "../api/getExcel";
import { FilterTable } from "@/@core/features/FilterTable";
import { callcenterColumns } from "@/@core/application/helper/callCenterColumns";
import { globalVars } from "@/@core/shared/types";
import { GlobalVars } from "@/@core/shared/vars";

export const Requests: FC = () => {
  const breadcrumb = [
    {
      id: 1,
      title: "Мурожаатлар",
    },
    {
      id: 2,
      title: "Колл-маркази",
    },
  ];
  const params = useSearchParams();
  const router = useRouter();
  const { current, pageSize, total, setTotal } = usePagination();
  const {
    getDistrictByRegionId,
    setDistrict,
    getDistrict,
    getOperators,
    getPodrazdel,
    getRegions,
    getOrganizations,
  } = useGlobal();
  const { data, GET } = useRequest();

  const getData = async () => {
    const query = {
      page: current,
      pageSize: pageSize,
      status: params.get("status") || GlobalVars.NullString,
      phone:
        params.has("phone") && params.get("phone") !== GlobalVars.NullString
          ? `+${String(params.get("phone")).trim()}`
          : GlobalVars.NullString,
      applicant_birthday:
        params.get("applicant_birthday") || GlobalVars.NullString,
      operators: params.get("operators") || GlobalVars.NullString,
      applicant: params.get("applicant") || "",
      application_type: params.get("application_type") || GlobalVars.NullString,
      response: params.get("response") || GlobalVars.NullString,
      income_number: params.get("income_number") || GlobalVars.NullString,
      region: params.get("region") || GlobalVars.NullString,
      district: params.get("district") || GlobalVars.NullString,
      subCategoryId: params.get("subCategoryId") || GlobalVars.NullString,
      date_from:
        params.get("date_from") !== GlobalVars.NullString &&
        params.get("date_from")
          ? new Intl.DateTimeFormat("ru-RU").format(
              new Date(params.get("date_from") || GlobalVars.NullString)
            )
          : GlobalVars.NullString,
      date_to:
        params.get("date_to") !== GlobalVars.NullString && params.get("date_to")
          ? new Intl.DateTimeFormat("ru-RU").format(
              new Date(params.get("date_to") || GlobalVars.NullString)
            )
          : GlobalVars.NullString,
    };

    const res = await GET(query);

    res.status === 200 && setTotal(res?.data?.pagination?.totalItems);
  };
  // get-all-data
  useEffect(() => {
    Promise.all([
      getPodrazdel(),
      getRegions(),
      getDistrict(),
      getOrganizations({
        page: GlobalVars.FirstPage,
        pageSize: GlobalVars.All,
        search: GlobalVars.NullString,
      }),
      getOperators({
        page: GlobalVars.FirstPage,
        pageSize: GlobalVars.All,
        search: GlobalVars.NullString,
        role: "operator",
      }),
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Promise.all([getData()]).then(() => {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // FINISH
  const handleFinish = (values: any) => {
    const query = `?${globalVars.page}=1&${globalVars.pageSize}=${pageSize}&${
      globalVars.operators
    }=${values.operators || GlobalVars.NullString}&${globalVars.status}=${
      values.status || GlobalVars.NullString
    }&${globalVars.phone}=${values.phone || GlobalVars.NullString}&${
      globalVars.applicant_birthday
    }=${values.applicant_birthday || GlobalVars.NullString}&${
      globalVars.applicant
    }=${values.applicant || GlobalVars.NullString}&${globalVars.response}=${
      values.response || GlobalVars.NullString
    }&${globalVars.income_number}=${
      values.income_number || GlobalVars.NullString
    }&${globalVars.region}=${values.region || GlobalVars.NullString}&${
      globalVars.district
    }=${values.district || GlobalVars.NullString}&${globalVars.subCategoryId}=${
      values.subCategoryId || GlobalVars.NullString
    }&${globalVars.application_type}=${
      values.application_type || GlobalVars.NullString
    }&${globalVars.date_from}=${values.date_from || GlobalVars.NullString}&${
      globalVars.date_to
    }=${values.date_to || GlobalVars.NullString}`;

    router.push(query);
  };
  // PAGINATION
  const handlePageChange = (page: number) => {
    router.push(
      `?${globalVars.page}=${page}&${globalVars.pageSize}=${pageSize}&${
        globalVars.operators
      }=${params.get(`${globalVars.operators}`)}&${globalVars.status}=${
        params.get(`${globalVars.status}`) || GlobalVars.NullString
      }&${globalVars.applicant}=${
        params.get(`${globalVars.applicant}`) || GlobalVars.NullString
      }&${globalVars.phone}=${
        params.get(`${globalVars.phone}`) || GlobalVars.NullString
      }&${globalVars.response}=${
        params.get(`${globalVars.response}`) || GlobalVars.NullString
      }&${globalVars.applicant_birthday}=${
        params.get(`${globalVars.applicant_birthday}`) || GlobalVars.NullString
      }&${globalVars.income_number}=${
        params.get(`${globalVars.income_number}`) || GlobalVars.NullString
      }&${globalVars.region}=${
        params.get(`${globalVars.region}`) || GlobalVars.NullString
      }&${globalVars.district}=${
        params.get(`${globalVars.district}`) || GlobalVars.NullString
      }&${globalVars.subCategoryId}=${
        params.get(`${globalVars.subCategoryId}`) || GlobalVars.NullString
      }&${globalVars.application_type}=${
        params.get(`${globalVars.application_type}`) || GlobalVars.NullString
      }&${globalVars.date_from}=${
        params.get(`${globalVars.date_from}`) || GlobalVars.NullString
      }&${globalVars.date_to}=${
        params.get(`${globalVars.date_to}`) || GlobalVars.NullString
      }`
    );
  };
  const handlePageSizeChange = (pageSize: number) => {
    router.push(
      `?${globalVars.page}=1&${globalVars.pageSize}=${pageSize}&${
        globalVars.operators
      }=${params.get(`${globalVars.operators}`)}&${globalVars.phone}=${
        params.get(`${globalVars.phone}`) || GlobalVars.NullString
      }&${globalVars.applicant_birthday}=${
        params.get(`${globalVars.applicant_birthday}`) || GlobalVars.NullString
      }&${globalVars.applicant}=${
        params.get(`${globalVars.applicant}`) || GlobalVars.NullString
      }&${globalVars.response}=${params.get(`${globalVars.response}`)}&${
        globalVars.income_number
      }=${params.get(`${globalVars.income_number}`) || GlobalVars.NullString}&${
        globalVars.region
      }=${params.get(`${globalVars.region}`) || GlobalVars.NullString}&${
        globalVars.district
      }=${params.get(`${globalVars.district}`) || GlobalVars.NullString}&${
        globalVars.subCategoryId
      }=${params.get(`${globalVars.subCategoryId}`) || GlobalVars.NullString}&${
        globalVars.application_type
      }=${
        params.get(`${globalVars.application_type}`) || GlobalVars.NullString
      }&${globalVars.date_from}=${
        params.get(`${globalVars.date_from}`) || GlobalVars.NullString
      }&${globalVars.date_to}=${
        params.get(`${globalVars.date_to}`) || GlobalVars.NullString
      }`
    );
  };

  const handleChangeRegion = async (e: any) => {
    if (e?.value === GlobalVars.NullString) {
      await getDistrict();
    } else {
      const data = await getDistrictByRegionId(e?.value);
      data?.status === 200 &&
        setDistrict(
          data?.results.map((d: any, index: number) => ({
            index: index + 1,
            ...d,
          }))
        );
    }
  };

  return (
    <Box
      p={{ base: "5px 10px", sm: "5px 10px", md: "8px 16px", xl: "8px 16px" }}
    >
      <BreadCrumb item={breadcrumb} />
      <PaperContent>
        <Flex align={"center"} justify="space-between">
          <Text
            my={{ base: "8px", sm: "8px", md: "16px", xl: "16px" }}
            fontWeight={500}
            color={scssVariables.textGreyColor}
            fontSize={{ base: "18px", sm: "18px", md: "24px", xl: "24px" }}
          >
            Мурожаатлар руйхати: Колл-центр
          </Text>
          <Button
            leftIcon={
              <Image src="/excel.png" alt="excel" w={"18px"} h={"18px"} />
            }
            color={"green.300"}
            variant={"link"}
            fontSize={scssVariables.fonts.span}
            onClick={() => getcallcenterforExcel(callcenterColumns, data)}
          >
            Excel
          </Button>
        </Flex>
        {/* FILTER */}
        <FilterTable
          handleFinish={handleFinish}
          handleChangeRegion={handleChangeRegion}
        />
        <TableGen columns={callcenterColumns} dataSource={data} />
        <Pagination
          total={total}
          current={current}
          pageSize={pageSize}
          onChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </PaperContent>
    </Box>
  );
};
