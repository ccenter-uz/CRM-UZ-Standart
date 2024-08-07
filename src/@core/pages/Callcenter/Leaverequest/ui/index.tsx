"use client";
import { scssVariables } from "@/@core/application/utils/vars";
import BreadCrumb from "@/@core/shared/ui/Breadcrumb";
import { PaperContent } from "@/@core/shared/ui/PaperContent";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import {
  applicationTypeList,
  buttonStyle,
  inputStyle,
  labelStyle,
  organizationTypeList,
  resend_applicationList,
  responseList,
  selectStyle,
  statusList,
} from "../model/helper";
import { Controller, useForm } from "react-hook-form";
import { useGlobal } from "@/@core/application/store/global";
import { getItemById, create, createDraft, edit, editDraft } from "../api";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import AutocompleteSelect from "@/@core/shared/ui/Autocomplete";
import InputMask from "react-input-mask";
import Cookies from "js-cookie";

export const Leaverequest = () => {
  const params = useSearchParams();
  const breadcrumb = [
    {
      id: 0,
      title: params.get("edit") ? "<- Ортга" : "",
      href: "/callcenter/requests",
    },
    {
      id: 1,
      title: "Мурожаат қолдириш",
    },
    {
      id: 2,
      title: "Колл-маркази",
    },
  ];
  const {
    podrazdel,
    regions,
    district,
    getDistrictByRegionId,
    setDistrict,
    getDistrict,
    organizations,
    performers,
    getPerformers,
    getOrganizations,
    getPodrazdel,
    getRegions,
  } = useGlobal();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    Cookies.get("role") && setRole(Cookies.get("role") as string);
  }, []);

  // BTNS
  const handleButtons = useCallback(() => {
    if (params.get("edit")) {
      if (data[0]?.IsDraf === "false") {
        return (
          <Box
            w={"100%"}
            display={"flex"}
            justifyContent={"flex-end"}
            gap={"8px"}
          >
            <Button
              isLoading={loading}
              id="save"
              sx={buttonStyle}
              onClick={handleSubmit(handleEdit)}
            >
              Сақлаш
            </Button>
          </Box>
        );
      } else {
        return (
          <Box
            w={"100%"}
            display={"flex"}
            justifyContent={"flex-end"}
            gap={"8px"}
          >
            <Button
              id="draft"
              sx={{
                ...buttonStyle,
                bg: "transparent",
                color: scssVariables.primary,
                borderColor: scssVariables.primary,
                _hover: { bgColor: "transparent" },
              }}
              onClick={handleSubmit(handleEditDraft)}
              variant={"outline"}
              isLoading={loading}
            >
              Қоралама сақлаш
            </Button>
            <Button
              isLoading={loading}
              id="save"
              sx={buttonStyle}
              onClick={handleSubmit(handleEdit)}
            >
              Сақлаш
            </Button>
          </Box>
        );
      }
    } else {
      return (
        <Box
          w={"100%"}
          display={"flex"}
          justifyContent={"flex-end"}
          gap={"8px"}
        >
          <Button
            id="draft"
            sx={{
              ...buttonStyle,
              bg: "transparent",
              color: scssVariables.primary,
              borderColor: scssVariables.primary,
              _hover: { bgColor: "transparent" },
            }}
            onClick={handleSubmit(handleCreateDraft)}
            variant={"outline"}
            isLoading={loading}
          >
            Қоралама сақлаш
          </Button>
          <Button
            isLoading={loading}
            id="save"
            sx={buttonStyle}
            onClick={handleSubmit(handleCreate)}
          >
            Сақлаш
          </Button>
        </Box>
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, params]);

  // CREATE
  const handleCreate = async (values: any) => {
    setLoading(true);
    const data = await create({
      ...values,
      IsDraf: "false",
    });
    if (data?.status === 400 || data?.status === 500) return setLoading(false);
    data?.status === 201 &&
      (toast.success("Success", { position: "bottom-right" }),
      reset(),
      router.push("/callcenter/requests"));
  };
  // CREATE-DRAFT
  const handleCreateDraft = async (values: any) => {
    setLoading(true);
    const data = await createDraft({
      ...values,
      IsDraf: "true",
    });
    if (data?.status === 400 || data?.status === 500) return setLoading(false);
    data?.status === 201 &&
      (toast.success("Success", { position: "bottom-right" }),
      reset(),
      router.push("/callcenter/drafts"));
  };
  // EDIT
  const handleEdit = async (values: any) => {
    setLoading(true);
    const data = await edit(
      { ...values, IsDraf: "false" },
      params.get("edit") as string
    );
    if (data?.status === 400 || data?.status === 500) return setLoading(false);
    data?.status === 204 &&
      (toast.success("Success", { position: "bottom-right" }),
      reset(),
      router.push("/callcenter/requests"));
  };
  // EDIT-DRAFT
  const handleEditDraft = async (values: any) => {
    setLoading(true);
    const data = await editDraft(
      { ...values, IsDraf: "true" },
      params.get("edit") as string
    );
    if (data?.status === 400 || data?.status === 500) return setLoading(false);
    data?.status === 204 &&
      (toast.success("Success", { position: "bottom-right" }),
      reset(),
      router.push("/callcenter/drafts"));
  };

  const handleChangeRegion = async (e: { value: string }) => {
    if (e?.value === "null") {
      await getDistrict();
    } else {
      const data = await getDistrictByRegionId(e?.value);

      data?.status === 200 && setDistrict(data?.results);
    }
  };

  // get-all-data
  useEffect(() => {
    Promise.all([
      getPodrazdel(),
      getRegions(),
      getDistrict(),
      getOrganizations({ page: 1, pageSize: 100000, search: "null" }),
      getPerformers({ page: 1, pageSize: 100000, search: "null" }),
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (params.get("edit")) {
      getItemById(params.get("edit") || "").then((res) => {
        setData(res?.data);
        res?.data.map((item: any) => {
          return reset({
            operator_number: item?.operator_number,
            gender: item?.gender,
            additional_phone: item?.additional_phone,
            applicant_birthday: item?.applicant_birthday,
            mfy: item?.mfy,
            street_and_apartment: item?.street_and_apartment,
            region: item.districts?.region?.id,
            district_id: item.districts?.id,
            IsDraf: item.IsDraf,
            organization_type: item.organization_type,
            application_type: item.application_type,
            applicant: item.applicant,
            phone: item.phone,
            comment: item.comment,
            resend_application: item.resend_application,
            sub_category_id: item.sub_category_call_center?.id,
            id: item.id,
            perform_date: item.perform_date,
            performer: item.performer?.id,
            response: item?.response,
            executer: item?.executer?.id,
            status: item?.status,
          });
        });
      });
    } else {
      reset({
        operator_number: "",
        gender: "",
        additional_phone: "",
        applicant_birthday: "",
        mfy: "",
        street_and_apartment: "",
        region: null,
        district_id: null,
        IsDraf: "",
        organization_type: "null",
        application_type: "null",
        applicant: "",
        phone: "",
        comment: "",
        resend_application: "null",
        sub_category_id: null,
        id: "",
        perform_date: "",
        performer: "",
        response: "null",
        executer: "null",
        status: "1",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <Box
      p={{ base: "5px 10px", sm: "5px 10px", md: "8px 16px", xl: "8px 16px" }}
    >
      <BreadCrumb item={breadcrumb} />
      <PaperContent>
        <Text
          textAlign={"center"}
          my={{ base: "8px", sm: "8px", md: "16px", xl: "16px" }}
          fontWeight={500}
          color={scssVariables.textGreyColor}
          fontSize={scssVariables.fonts.titleSize}
        >
          {params.get("edit") ? "Мурожаатни тахрирлаш" : "Мурожаат яратиш"}
        </Text>
        <Box p={{ base: "5px", sm: "5px", md: "16px", xl: " 16px" }}>
          <form id="application-form">
            <FormControl isInvalid={!!errors.applicant}>
              <FormLabel htmlFor="applicant" sx={labelStyle}>
                Мурожаатчи
              </FormLabel>
              <Input
                sx={inputStyle}
                id="applicant"
                placeholder="Азизов Азиз Азизович"
                type="text"
                {...register("applicant", { required: true })}
              />
              <FormErrorMessage
                color={"red.300"}
                fontSize={scssVariables.fonts.span}
              >
                мажбурий катак
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.applicant_birthday}>
              <FormLabel htmlFor="applicant_birthday" sx={labelStyle}>
                Мурожаатчининг туғилган санаси
              </FormLabel>
              <Input
                sx={inputStyle}
                id="applicant_birthday"
                type="date"
                {...register("applicant_birthday", { required: true })}
              />
              <FormErrorMessage
                color={"red.300"}
                fontSize={scssVariables.fonts.span}
              >
                мажбурий катак
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.gender}>
              <FormLabel htmlFor="gender" sx={labelStyle}>
                Жинси
              </FormLabel>
              <Select
                sx={selectStyle}
                id="gender"
                {...register("gender", { required: true })}
              >
                <option value="">Танланг</option>
                <option value="male">Эркак</option>
                <option value="female">Аёл</option>
              </Select>
              <FormErrorMessage
                color={"red.300"}
                fontSize={scssVariables.fonts.span}
              >
                мажбурий катак
              </FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="phone" sx={labelStyle}>
                Телефон рақам
              </FormLabel>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    sx={inputStyle}
                    as={InputMask}
                    mask="+(999)99 999-99-99"
                    maskChar=""
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="+(999)99 999-99-99"
                  />
                )}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="additional_phone" sx={labelStyle}>
                Қўшимча телефон рақам
              </FormLabel>
              <Controller
                name="additional_phone"
                control={control}
                render={({ field }) => (
                  <Input
                    sx={inputStyle}
                    as={InputMask}
                    mask="+(999)99 999-99-99"
                    maskChar=""
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="+(999)99 999-99-99"
                  />
                )}
              />
            </FormControl>
            <FormControl isInvalid={!!errors.region}>
              <FormLabel htmlFor="region" sx={labelStyle}>
                Вилоят
              </FormLabel>
              <AutocompleteSelect
                required
                name="region"
                control={control}
                options={[
                  { value: "null", label: "Барчаси" },
                  ...regions?.map((region: any) => ({
                    value: region.id,
                    label:
                      region.title[0].toUpperCase() + region.title.slice(1),
                  })),
                ]}
                onChange={handleChangeRegion}
              />

              <FormErrorMessage
                color={"red.300"}
                fontSize={scssVariables.fonts.span}
              >
                мажбурий катак
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.district_id}>
              <FormLabel htmlFor="district_id" sx={labelStyle}>
                Туман
              </FormLabel>
              <AutocompleteSelect
                required
                name="district_id"
                control={control}
                options={[
                  { value: "null", label: "Барчаси" },
                  ...district?.map((dist: any) => ({
                    value: dist.id,
                    label: dist.title,
                  })),
                ]}
              />

              <FormErrorMessage
                color={"red.300"}
                fontSize={scssVariables.fonts.span}
              >
                мажбурий катак
              </FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="mfy" sx={labelStyle}>
                Махалла (МФЙ-ҚФЙ-ОФЙ)
              </FormLabel>
              <Input
                sx={inputStyle}
                id="mfy"
                type="text"
                placeholder="Боғ-кўча МФЙ"
                {...register("mfy")}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="street_and_apartment" sx={labelStyle}>
                Кўча ва уй
              </FormLabel>
              <Input
                sx={inputStyle}
                placeholder="Миришкор кўчаси, 8-уй"
                id="street_and_apartment"
                type="text"
                {...register("street_and_apartment")}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="organization_type" sx={labelStyle}>
                Юридик / Жисмоний шахс
              </FormLabel>
              <Select
                sx={selectStyle}
                id="organization_type"
                {...register("organization_type")}
              >
                <option value={"null"}>Танланг</option>
                {organizationTypeList.map((organizationType) => (
                  <option
                    key={organizationType.id}
                    value={organizationType.label}
                  >
                    {organizationType.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="application_type" sx={labelStyle}>
                Мурожаат тури
              </FormLabel>
              <Select
                sx={selectStyle}
                id="application_type"
                {...register("application_type")}
              >
                <option value={"null"}>Танланг</option>
                {applicationTypeList.map((applicationType) => (
                  <option
                    key={applicationType.id}
                    value={applicationType.label}
                  >
                    {applicationType.label}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isInvalid={!!errors.sub_category_id}>
              <FormLabel htmlFor="sub_category_id" sx={labelStyle}>
                Тасниф
              </FormLabel>
              <AutocompleteSelect
                required
                name="sub_category_id"
                control={control}
                options={[
                  { value: "null", label: "Барчаси" },
                  ...podrazdel?.map((field: any) => ({
                    value: field.id,
                    label: field.title,
                  })),
                ]}
              />
              <FormErrorMessage
                color={"red.300"}
                fontSize={scssVariables.fonts.span}
              >
                мажбурий катак
              </FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="comment" sx={labelStyle}>
                Мурожаатнинг қисқача мазмуни
              </FormLabel>
              <Textarea sx={inputStyle} id="comment" {...register("comment")} />
            </FormControl>
            <FormControl isInvalid={!!errors.operator_number}>
              <FormLabel htmlFor="operator_number" sx={labelStyle}>
                Оператор №
              </FormLabel>
              <Input
                sx={inputStyle}
                id="operator_number"
                {...register("operator_number", {
                  required: true,
                })}
              />
              <FormErrorMessage
                color={"red.300"}
                fontSize={scssVariables.fonts.span}
              >
                мажбурий катак
              </FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="resend_application" sx={labelStyle}>
                Янги мурожаат ёки Такрорий мурожаатлар
              </FormLabel>
              <Select
                sx={selectStyle}
                id="resend_application"
                {...register("resend_application")}
              >
                <option value={"null"}>Танланг</option>
                {resend_applicationList.map((resend_application) => (
                  <option
                    key={resend_application.id}
                    value={resend_application.label}
                  >
                    {resend_application.label}
                  </option>
                ))}
              </Select>
            </FormControl>
            {role === "admin" ? (
              <FormControl>
                <FormLabel htmlFor="performer" sx={labelStyle}>
                  Ижрочи
                </FormLabel>
                {/* <AutocompleteSelect
                  name="performer"
                  control={control}
                  options={[
                    { value: "null", label: "Барчаси" },
                    ...performers?.map((dist: any) => ({
                      value: dist.id,
                      label:
                        dist.title[0]?.toUpperCase() + dist?.title?.slice(1),
                    })),
                  ]}
                /> */}
              </FormControl>
            ) : null}
            {role === "admin" ? (
              <FormControl>
                <FormLabel htmlFor="perform_date" sx={labelStyle}>
                  Ижро қилинган сана
                </FormLabel>
                <Input
                  sx={inputStyle}
                  id="perform_date"
                  type="date"
                  {...register("perform_date")}
                />
              </FormControl>
            ) : null}
            {role === "admin" ? (
              <FormControl>
                <FormLabel htmlFor="executer" sx={labelStyle}>
                  Рахбарият
                </FormLabel>
                <AutocompleteSelect
                  name="executer"
                  control={control}
                  options={[
                    { value: "null", label: "Барчаси" },
                    ...organizations?.map((dist: any) => ({
                      value: dist.id,
                      label: dist.title[0].toUpperCase() + dist.title.slice(1),
                    })),
                  ]}
                />
              </FormControl>
            ) : null}
            {role === "admin" ? (
              <FormControl>
                <FormLabel htmlFor="response" sx={labelStyle}>
                  Мурожаатни жавоби
                </FormLabel>
                <Select
                  sx={selectStyle}
                  id="response"
                  {...register("response")}
                >
                  <option value={"null"}>Танланг</option>
                  {responseList.map((response) => (
                    <option key={response.id} value={response.label}>
                      {response.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            {role === "admin" ? (
              <FormControl>
                <FormLabel htmlFor="status" sx={labelStyle}>
                  Мурожаат холати
                </FormLabel>
                <Select sx={selectStyle} id="status" {...register("status")}>
                  {statusList.map((status) => (
                    <option key={status.id} value={status.label}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            ) : null}
          </form>
        </Box>
      </PaperContent>
      {handleButtons()}
    </Box>
  );
};
