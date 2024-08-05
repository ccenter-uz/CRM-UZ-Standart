"use client";
import { PaperContent } from "@/@core/shared/ui/PaperContent";
import { FC, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Card,
  CardBody,
  HStack,
  Button,
  Tooltip,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import { TriangleDownIcon } from "@chakra-ui/icons";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { SimpleGrid } from "@chakra-ui/react";
import { UzbMap } from "@/@core/shared/ui/UzbMap";
import { buttonStyle, Dashboardcolumns, labelStyle } from "../model/helper";
import { useGlobal } from "@/@core/application/store/global";
import BreadCrumb from "@/@core/shared/ui/Breadcrumb";
import { scssVariables } from "@/@core/application/utils/vars";
import { Eye, EyeOff, Search, X } from "react-feather";
import TableGen from "@/@core/shared/ui/Table";
import Pagination from "@/@core/shared/ui/Pagination";
import { usePagination } from "@/@core/shared/hook/usePaginate";
import { useForm } from "react-hook-form";
import {
  getBarGraph,
  getDataWithRegion,
  getLineGraph,
  getTableData,
  postChangeRazdel,
} from "../api";
import { useRouter, useSearchParams } from "next/navigation";
import { useDashboardSlicer } from "../model/Slicer";
import { BarChart } from "./BarChart";
import { LineChart } from "./LineGraph";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import AutocompleteSelect from "@/@core/shared/ui/Autocomplete";

export const Dashboard: FC<any> = (props) => {
  const breadcrumbs = [
    {
      id: 1,
      title: "Бош саҳифа",
    },
    {
      id: 2,
      title: "Cтатистика",
    },
  ];
  const params = useSearchParams();
  const router = useRouter();
  const { current, pageSize, total, setTotal } = usePagination();
  const { razdel, regions, podrazdel, getPodrazdel, setPodrazdel } =
    useGlobal();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm();
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    reset: reset1,
    formState: { errors: errors1 },
  } = useForm();
  const { id, dataWithRegion, setDataWithRegion, tableData, setTableData } =
    useDashboardSlicer();
  const screenMap = useFullScreenHandle();
  const screenGraph = useFullScreenHandle();
  const screenTable = useFullScreenHandle();
  const [lineGraph, setLineGraph] = useState<any>(false);
  const [barGraph, setBarGraph] = useState<any>(false);

  // GET-MAP
  const getData = async () => {
    const params = {
      region: id,
    };
    const res = await getDataWithRegion(params);
    res?.status === 200 && setDataWithRegion(res?.data);
  };

  // GET-LINEGRAPH
  const getLine = async () => {
    let query;
    const errorCase = ["null", "", null];
    if (
      !errorCase.includes(params.get("date_from")) &&
      !errorCase.includes(params.get("date_to"))
    ) {
      let date_from = new Date(params.get("date_from") || "");
      let date_to = new Date(params.get("date_to") || "");
      query = {
        date_from: Intl.DateTimeFormat("ru-RU").format(date_from),
        date_to: Intl.DateTimeFormat("ru-RU").format(date_to),
      };

      const res = await getLineGraph(query);

      res?.status === 200 && setLineGraph(res?.data);
    } else {
      const res = await getLineGraph();

      res?.status === 200 && setLineGraph(res?.data);
    }
  };
  // GET-BARGRAPH
  const getBar = async () => {
    let query;
    const errorCase = ["null", "", null];
    if (
      !errorCase.includes(params.get("date_from")) &&
      !errorCase.includes(params.get("date_to"))
    ) {
      let date_from = new Date(params.get("date_from") || "");
      let date_to = new Date(params.get("date_to") || "");
      query = {
        date_from: Intl.DateTimeFormat("ru-RU").format(date_from),
        date_to: Intl.DateTimeFormat("ru-RU").format(date_to),
      };

      const res = await getBarGraph(query);

      res?.status === 200 && setBarGraph(res?.data);
    } else {
      const res = await getBarGraph();

      res?.status === 200 && setBarGraph(res?.data);
    }
  };
  // GET-TABLE-DATA
  const getDataTable = async () => {
    const queryParams = {
      region: params.get("region") || null,
      page: "1",
      pageSize: params.get("limit") || "10",
      subCategoryId: params.get("subCategoryId") || null,
    };
    const res = await getTableData(queryParams);

    res?.status === 200 &&
      (setTableData(
        res?.data?.results?.map((item: any, index: number) => ({
          index: index + 1,
          podrazdel: item?.sub_category_orgs?.title,
          income: item?.sub_category_orgs?.count,
          region: item?.sub_category_orgs?.region?.title,
        }))
      ),
      setTotal(res?.data?.pagination?.totalItems));
  };

  // FINISH-POST
  const handleFinish = async (values: any) => {
    const query = `?&limit=${pageSize}&region=${values.region}&subCategoryId=${
      values.subCategoryId
    }&date_from=${params.get("date_from")}&date_to=${params.get("date_to")}`;

    router.push(query, { scroll: false });
  };

  // CHANGE
  const handleChangeRazdel = async (e: { value: string }) => {
    if (e?.value === "null") {
      await getPodrazdel();
    } else {
      const data = await postChangeRazdel(e?.value);

      data?.status === 200 && setPodrazdel(data?.data.results);
    }
  };

  // CHANGE-PAGE-LIMIT
  const handlePageSizeChange = (pageSize: number) => {
    const query = `?limit=${pageSize}&region=${params.get(
      "region"
    )}&subCategoryId=${params.get("subCategoryId")}`;

    router.push(query);
  };

  // CLEAR
  const handleClear = async () => {
    reset({
      region: "null",
      categoryId: "null",
      subCategoryId: "null",
    });
    if (params.get("date_from") && params.get("date_to")) {
      return router.push(
        `?&limit=${pageSize}&date_from=${params.get(
          "date_from"
        )}&date_to=${params.get("date_to")}`
      );
    } else {
      return router.push("?", { scroll: false });
    }
  };

  // Search-Graph
  const searchGraph = async (values: any) => {
    const query = `?&limit=${pageSize}&region=${params.get(
      "region"
    )}&subCategoryId=${params.get("subCategoryId")}&date_from=${
      values.date_from
    }&date_to=${values.date_to}`;
    router.push(query, { scroll: false });
  };

  // Clear-Graph
  const clearGraph = async () => {
    reset1({
      date_from: null,
      date_to: null,
    });
    if (
      params.get("region") &&
      params.get("categoryId") &&
      params.get("subCategoryId")
    ) {
      return router.push(
        `?&limit=${pageSize}&region=${params.get(
          "region"
        )}&subCategoryId=${params.get("subCategoryId")}`,
        { scroll: false }
      );
    } else {
      return router.push("?", { scroll: false });
    }
  };

  // RESET
  useEffect(() => {
    const timeout = setTimeout(() => {
      reset({
        region: params.get("region") || "null",
        subCategoryId: params.get("subCategoryId") || "null",
      });
      reset1({
        date_from: params.get("date_from") || "",
        date_to: params.get("date_to") || "",
      });
    }, 1000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // LOAD-MAP-BY-ID
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // LOAD-TABLE-DATA
  useEffect(() => {
    Promise.all([getLine(), getBar(), getDataTable()]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <Box
      p={{ base: "5px 10px", sm: "5px 10px", md: "8px 16px", xl: "8px 16px" }}
    >
      {/* BREADCRUMB */}
      <Flex className="breadcrumb" justifyContent={"flex-end"}>
        <BreadCrumb item={breadcrumbs} />
      </Flex>

      {/* MAP */}
      <Box className="map">
        <FullScreen handle={screenMap}>
          <Text fontSize={{ base: "17px", sm: "17px", md: "22px", xl: "22px" }}>
            Ҳудудлар бўйича статистика:
          </Text>
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 2, xl: 4 }}
            my={"8px"}
            gap={"8px"}
          >
            <Card variant="outline" borderColor={"lightgrey"}>
              <CardBody
                p={{ base: "10px", sm: "10px", md: "20px", xl: "20px" }}
                h={"auto"}
                bg={"green.300"}
                color={"white"}
              >
                <HStack
                  flexDirection={{
                    base: "column",
                    sm: "column",
                    md: "column",
                    xl: "row",
                  }}
                  alignItems={"center"}
                  justify={"center"}
                  gap={{ base: "5px", sm: "5px", md: "10px", xl: "10px" }}
                >
                  <TriangleDownIcon width={"20px"} height={"20px"} />
                  <Text
                    fontSize={{
                      base: "14px",
                      sm: "14px",
                      md: "18px",
                      xl: "18px",
                    }}
                  >
                    Жами мурожаатлар:
                  </Text>
                  <Text
                    fontWeight={600}
                    fontSize={scssVariables.fonts.titleSize}
                  >
                    {dataWithRegion?.Applicationcount || 0}
                  </Text>
                </HStack>
              </CardBody>
            </Card>
            <Card variant="outline" borderColor={"lightgrey"}>
              <CardBody
                p={{ base: "10px", sm: "10px", md: "20px", xl: "20px" }}
                bg={"teal.300"}
                color={"white"}
              >
                <HStack
                  flexDirection={{
                    base: "column",
                    sm: "column",
                    md: "column",
                    xl: "row",
                  }}
                  alignItems={"center"}
                  justify={"center"}
                  gap={{ base: "5px", sm: "5px", md: "10px", xl: "10px" }}
                >
                  <Eye width={"20px"} height={"20px"} />
                  <Text
                    fontSize={{
                      base: "14px",
                      sm: "14px",
                      md: "18px",
                      xl: "18px",
                    }}
                  >
                    Тушунтирилганлар:
                  </Text>
                  <Text
                    fontWeight={600}
                    fontSize={scssVariables.fonts.titleSize}
                  >
                    {dataWithRegion?.ApplicationExplainedcount || 0}
                  </Text>
                </HStack>
              </CardBody>
            </Card>
            <Card variant="outline" borderColor={"lightgrey"}>
              <CardBody
                p={{ base: "10px", sm: "10px", md: "20px", xl: "20px" }}
                h={"auto"}
                bg={"red.300"}
                color={"white"}
              >
                <HStack
                  flexDirection={{
                    base: "column",
                    sm: "column",
                    md: "column",
                    xl: "row",
                  }}
                  alignItems={"center"}
                  justify={"center"}
                  gap={{ base: "5px", sm: "5px", md: "10px", xl: "10px" }}
                >
                  <EyeOff width={"20px"} height={"20px"} />
                  <Text
                    fontSize={{
                      base: "14px",
                      sm: "14px",
                      md: "18px",
                      xl: "18px",
                    }}
                  >
                    Қаноатлантирилганлар:
                  </Text>
                  <Text
                    fontWeight={600}
                    fontSize={scssVariables.fonts.titleSize}
                  >
                    {dataWithRegion?.ApplicationSatisfiedcount || 0}
                  </Text>
                </HStack>
              </CardBody>
            </Card>
            <Card variant="outline" borderColor={"lightgrey"}>
              <CardBody
                p={{ base: "10px", sm: "10px", md: "20px", xl: "20px" }}
                bg={"purple.300"}
                color={"white"}
              >
                <HStack
                  flexDirection={{
                    base: "column",
                    sm: "column",
                    md: "column",
                    xl: "row",
                  }}
                  alignItems={"center"}
                  justify={"center"}
                  gap={{ base: "5px", sm: "5px", md: "10px", xl: "10px" }}
                >
                  <X width={"22px"} height={"22px"} />
                  <Text
                    fontSize={{
                      base: "14px",
                      sm: "14px",
                      md: "18px",
                      xl: "18px",
                    }}
                  >
                    Аноним:
                  </Text>
                  <Text
                    fontWeight={600}
                    fontSize={scssVariables.fonts.titleSize}
                  >
                    {dataWithRegion?.ApplicationAnonymouscount || 0}
                  </Text>
                </HStack>
              </CardBody>
            </Card>
          </SimpleGrid>
          <PaperContent>
            <Tooltip label="Катта қилиш">
              <Eye
                onClick={() =>
                  screenMap.active ? screenMap.exit() : screenMap.enter()
                }
                cursor={"pointer"}
                color="grey"
                width={"22px"}
                height={"22px"}
                style={{ marginLeft: "auto" }}
              />
            </Tooltip>
            <Flex
              align={"center"}
              justify={{ base: "flex-start", xl: "space-between" }}
              gap={{ base: "10px", sm: "10px", md: "20px", xl: "24px" }}
              flexDirection={{
                base: "column",
                sm: "column",
                md: "column",
                xl: "row",
              }}
            >
              <Box
                flex={0.8}
                h={"auto"}
                mx={"auto"}
                display={"flex"}
                justifyContent={"center"}
              >
                <UzbMap />
              </Box>
            </Flex>
          </PaperContent>
        </FullScreen>
      </Box>

      {/* GRAPH */}
      <FullScreen handle={screenGraph} className="graph">
        <PaperContent>
          <Flex align={"center"} mb={"16px"}>
            <Text
              fontSize={{ base: "17px", sm: "17px", md: "22px", xl: "22px" }}
            >
              Графиклар{" "}
              <Text as={"span"} fontSize={scssVariables.fonts.parag}>
                (бошланиш ва тугаш саналари)
              </Text>
            </Text>
            <Tooltip label="Катта қилиш">
              <Eye
                onClick={() =>
                  screenGraph.active ? screenGraph.exit() : screenGraph.enter()
                }
                cursor={"pointer"}
                color="grey"
                width={"22px"}
                height={"22px"}
                style={{ marginLeft: "auto" }}
              />
            </Tooltip>
          </Flex>

          <form onSubmit={handleSubmit1(searchGraph)} id="graph-form">
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3, xl: 3 }}
              alignItems={"center"}
              gap={{ base: "10px", sm: "10px", md: "20px", xl: "20px" }}
            >
              <Input
                type="date"
                aria-label="date-from"
                id="date-from"
                {...register1("date_from")}
              />
              <Input
                type="date"
                aria-label="date-to"
                id="date-to"
                {...register1("date_to")}
              />
              <Flex align={"center"} gap={"10px"} my={"8px"}>
                <Button
                  onClick={clearGraph}
                  variant={"outline"}
                  sx={{
                    ...buttonStyle,
                    bg: "transparent",
                    color: scssVariables.primary,
                    borderColor: scssVariables.primary,
                    _hover: {
                      bg: "transparent",
                      opacity: 0.7,
                    },
                  }}
                  leftIcon={<X width={"18px"} height={"18px"} />}
                >
                  Тозалаш
                </Button>
                <Button
                  form="graph-form"
                  type="submit"
                  sx={buttonStyle}
                  leftIcon={<Search width={"18px"} height={"18px"} />}
                >
                  Қидириш
                </Button>
              </Flex>
            </SimpleGrid>
          </form>
        </PaperContent>
        <SimpleGrid
          alignItems={"flex-start"}
          columns={{ base: 1, sm: 1, md: 2, xl: 2 }}
        >
          <PaperContent>
            <Box w={"100%"} h={"fit-content"}>
              <LineChart data={lineGraph} />
              <SimpleGrid columns={2}>
                <List>
                  {Array.from(lineGraph)
                    ?.slice(0, 7)
                    .map((item: any, index: number) => (
                      <ListItem
                        key={item.id}
                        fontSize={scssVariables.fonts.span}
                        color={scssVariables.textGreyColor}
                      >
                        {index + 1}. {item?.title}
                      </ListItem>
                    ))}
                </List>
                <List>
                  {Array.from(lineGraph)
                    ?.slice(7)
                    .map((item: any, index: number) => (
                      <ListItem
                        key={item.id}
                        fontSize={scssVariables.fonts.span}
                        color={scssVariables.textGreyColor}
                      >
                        {index + 8}. {item?.title}
                      </ListItem>
                    ))}
                </List>
              </SimpleGrid>
            </Box>
          </PaperContent>
          <PaperContent>
            <Box w={"100%"} h={"fit-content"}>
              <BarChart data={barGraph} />
              <SimpleGrid columns={{ base: 1, sm: 1, md: 2, xl: 2 }}>
                <List>
                  {Array.from(barGraph)
                    ?.slice(0, 5)
                    ?.map((item: any, index: number) => (
                      <ListItem
                        key={item.id}
                        fontSize={scssVariables.fonts.span}
                        color={scssVariables.textGreyColor}
                      >
                        {index + 1}. {item?.title}
                      </ListItem>
                    ))}
                </List>
                <List>
                  {Array.from(barGraph)
                    ?.slice(5, 10)
                    ?.map((item: any, index: number) => (
                      <ListItem
                        key={item.id}
                        fontSize={scssVariables.fonts.span}
                        color={scssVariables.textGreyColor}
                      >
                        {index + 6}. {item?.title}
                      </ListItem>
                    ))}
                </List>
              </SimpleGrid>
            </Box>
          </PaperContent>
        </SimpleGrid>
      </FullScreen>

      {/* TABLE */}
      <FullScreen handle={screenTable}>
        <Box className="table">
          <PaperContent>
            <Flex align={"center"}>
              <Text
                fontSize={{ base: "17px", sm: "17px", md: "22px", xl: "22px" }}
              >
                Энг кўп мурожаатлар рўйхати:
              </Text>
              <Tooltip label="Катта қилиш">
                <Eye
                  onClick={() =>
                    screenTable.active
                      ? screenTable.exit()
                      : screenTable.enter()
                  }
                  cursor={"pointer"}
                  color="grey"
                  width={"22px"}
                  height={"22px"}
                  style={{ marginLeft: "auto" }}
                />
              </Tooltip>
            </Flex>
            <Flex
              my={"8px"}
              alignItems={"flex-end"}
              justifyContent={"space-between"}
              gap={"8px"}
              flexDirection={{
                base: "column",
                sm: "column",
                md: "column",
                xl: "row",
              }}
            >
              <form
                id="dashboard-form"
                onSubmit={handleSubmit(handleFinish)}
                style={{ width: "100%" }}
              >
                <Flex
                  w={"100%"}
                  gap={"8px"}
                  alignItems={"flex-end"}
                  flexDirection={{
                    base: "column",
                    sm: "column",
                    md: "column",
                    xl: "row",
                  }}
                >
                  <FormControl>
                    <FormLabel htmlFor="region" sx={labelStyle}>
                      Ҳудудлар
                    </FormLabel>
                    <AutocompleteSelect
                      name="region"
                      control={control}
                      options={[
                        { value: "null", label: "Барчаси" },
                        ...regions?.map((region: any) => ({
                          value: region.id,
                          label:
                            region.title[0].toUpperCase() +
                            region.title.slice(1),
                        })),
                      ]}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="subCategoryId" sx={labelStyle}>
                      Тасниф:
                    </FormLabel>
                    <AutocompleteSelect
                      name="subCategoryId"
                      control={control}
                      options={[
                        { value: "null", label: "Барчаси" },
                        ...podrazdel?.map((field: any) => ({
                          value: field.id,
                          label: field.title,
                        })),
                      ]}
                    />
                  </FormControl>
                </Flex>
              </form>
              <Flex align={"center"} gap={"10px"}>
                <Button
                  onClick={handleClear}
                  variant={"outline"}
                  sx={{
                    ...buttonStyle,
                    bg: "transparent",
                    color: scssVariables.primary,
                    borderColor: scssVariables.primary,
                    _hover: {
                      bg: "transparent",
                      opacity: 0.7,
                    },
                  }}
                  leftIcon={<X width={"18px"} height={"18px"} />}
                >
                  Тозалаш
                </Button>
                <Button
                  form="dashboard-form"
                  type="submit"
                  sx={buttonStyle}
                  leftIcon={<Search width={"18px"} height={"18px"} />}
                >
                  Қидириш
                </Button>
              </Flex>
            </Flex>
          </PaperContent>
          <PaperContent>
            <Box w={"100%"} h={"auto"}>
              <TableGen
                ColBg="transparent"
                RowBg="transparent"
                boxShadow="none"
                dataSource={tableData}
                columns={Dashboardcolumns}
              />
              <Pagination
                current={current}
                pageSize={pageSize}
                total={total}
                onChange={() => null}
                hideButtons
                onPageSizeChange={handlePageSizeChange}
              />
            </Box>
          </PaperContent>
        </Box>
      </FullScreen>
    </Box>
  );
};
