"use client";
import { scssVariables } from "@/@core/application/utils/vars";
import { usePagination } from "@/@core/shared/hook/usePaginate";
import BreadCrumb from "@/@core/shared/ui/Breadcrumb";
import Pagination from "@/@core/shared/ui/Pagination";
import { PaperContent } from "@/@core/shared/ui/PaperContent";
import TableGen from "@/@core/shared/ui/Table";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { ChangeEvent, FC, useEffect } from "react";
import { useGlobal } from "@/@core/application/store/global";
import { useRouter, useSearchParams } from "next/navigation";
import { useRequest } from "../model/Slicer";
import { getcallcenterforExcel } from "../api/getExcel";
import { FilterTable } from "@/@core/features/FilterTable";
import { callcenterColumns } from "@/@core/application/helper/callCenterColumns";
import { globalVars } from "@/@core/shared/types";

export const Drafts: FC = () => {
  const breadcrumb = [
    {
      id: 1,
      title: "Мурожаатлар",
    },
    {
      id: 2,
      title: "Колл-маркази",
    },
    {
      id: 3,
      title: "Қораламалар",
    },
  ];
  const params = useSearchParams();
  const router = useRouter();
  const { current, pageSize, total, setTotal } = usePagination();

  const {
    getOrganizations,
    getDistrictByRegionId,
    setDistrict,
    getDistrict,
    getOperators,
    getPodrazdel,
    getRegions,
  } = useGlobal();
  const { data, GET } = useRequest();

  const getData = async () => {
    const query = {
      page: current,
      pageSize: pageSize,
      applicant: params.get("applicant") || "null",
      operators: params.get("operators") || "null",
      response: params.get("response") || "null",
      income_number: params.get("income_number") || "null",
      region: params.get("region") || "null",
      district: params.get("district") || "null",
      subCategoryId: params.get("subCategoryId") || "null",
      date_from:
        params.get("date_from") !== "null" && params.get("date_from")
          ? new Intl.DateTimeFormat("ru-RU").format(
              new Date(params.get("date_from") || "null")
            )
          : "null",
      date_to:
        params.get("date_to") !== "null" && params.get("date_to")
          ? new Intl.DateTimeFormat("ru-RU").format(
              new Date(params.get("date_to") || "null")
            )
          : "null",
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
      getOrganizations({ page: 1, pageSize: 100000, search: "null" }),
      getOperators({
        page: 1,
        pageSize: 1000000,
        search: "null",
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
    }=${values.operators || "null"}&${globalVars.applicant}=${
      values.applicant || "null"
    }&${globalVars.response}=${values.response || "null"}&${
      globalVars.income_number
    }=${values.income_number || "null"}&${globalVars.region}=${
      values.region || "null"
    }&${globalVars.district}=${values.district || "null"}&${
      globalVars.subCategoryId
    }=${values.subCategoryId || "null"}&${globalVars.date_from}=${
      values.date_from || "null"
    }&${globalVars.date_to}=${values.date_to || "null"}`;

    router.push(query);
  };
  // PAGINATION
  const handlePageChange = (page: number) => {
    router.push(
      `?${page}=1&${globalVars.pageSize}=${pageSize}&${
        globalVars.operators
      }=${params.get(`${globalVars.operators}`)}&${globalVars.applicant}=${
        params.get(`${globalVars.applicant}`) || "null"
      }&${globalVars.response}=${params.get(`${globalVars.response}`)}&${
        globalVars.income_number
      }=${params.get(`${globalVars.income_number}`) || "null"}&${
        globalVars.region
      }=${params.get(`${globalVars.region}`) || "null"}&${
        globalVars.district
      }=${params.get(`${globalVars.district}`) || "null"}&${
        globalVars.subCategoryId
      }=${params.get(`${globalVars.subCategoryId}`) || "null"}&${
        globalVars.date_from
      }=${params.get(`${globalVars.date_from}`) || "null"}&${
        globalVars.date_to
      }=${params.get(`${globalVars.date_to}`) || "null"}`
    );
  };
  const handlePageSizeChange = (pageSize: number) => {
    router.push(
      `?${globalVars.page}=1&${globalVars.pageSize}=${pageSize}&${
        globalVars.operators
      }=${params.get(`${globalVars.operators}`)}&${globalVars.applicant}=${
        params.get(`${globalVars.applicant}`) || "null"
      }&${globalVars.response}=${params.get(`${globalVars.response}`)}&${
        globalVars.income_number
      }=${params.get(`${globalVars.income_number}`) || "null"}&${
        globalVars.region
      }=${params.get(`${globalVars.region}`) || "null"}&${
        globalVars.district
      }=${params.get(`${globalVars.district}`) || "null"}&${
        globalVars.subCategoryId
      }=${params.get(`${globalVars.subCategoryId}`) || "null"}&${
        globalVars.date_from
      }=${params.get(`${globalVars.date_from}`) || "null"}&${
        globalVars.date_to
      }=${params.get(`${globalVars.date_to}`) || "null"}`
    );
  };

  const handleChangeRegion = async (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "null") {
      await getDistrict();
    } else {
      const data = await getDistrictByRegionId(e.target.value);
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
            Қораламалар руйхати: Колл-центр
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
