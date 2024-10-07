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
import { useForm } from "react-hook-form";
import { useGlobal } from "@/@core/application/store/global";
import { getItemById, create, createDraft, edit, editDraft } from "../api";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import AutocompleteSelect from "@/@core/shared/ui/Autocomplete";
import InputMask from "react-input-mask";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { GlobalVars } from "@/@core/shared/vars";

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
  const [disableRequireds, setDisableRequireds] = useState<boolean>(true);

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
              id="save"
              sx={buttonStyle}
              onClick={handleSubmit(handleEdit)}
              isDisabled={loading}
              isLoading={loading}
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
              isDisabled={loading}
              isLoading={loading}
            >
              Қоралама сақлаш
            </Button>
            <Button
              isDisabled={loading}
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
            isDisabled={loading}
            isLoading={loading}
          >
            Қоралама сақлаш
          </Button>
          <Button
            isDisabled={loading}
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
  }, [data, params, loading]);

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
    if (e?.value === GlobalVars.NullString) {
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
      getOrganizations({
        page: GlobalVars.FirstPage,
        pageSize: GlobalVars.All,
        search: GlobalVars.NullString,
      }),
      getPerformers({
        page: GlobalVars.FirstPage,
        pageSize: GlobalVars.All,
        search: GlobalVars.NullString,
      }),
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (params.get("edit")) {
      getItemById(params.get("edit") || "").then((res) => {
        setData(res?.data);
        if (res?.data[0]?.application_type === "Бошқа масалалар")
          setDisableRequireds(false);

        res?.data.map((item: any) => {
          return reset({
            response_story: item?.response_story,
            operator_number: item?.operator_number,
            gender: item?.gender,
            additional_phone: item?.additional_phone,
            applicant_birthday: item?.applicant_birthday,
            mfy: item?.mfy,
            street_and_apartment: item?.street_and_apartment,
            region: item.districts?.region?.id,
            district_id: item.districts?.id || GlobalVars.NullString,
            IsDraf: item.IsDraf,
            organization_type: item.organization_type,
            application_type: item.application_type,
            applicant: item.applicant,
            phone: item.phone,
            comment: item.comment,
            resend_application: item.resend_application,
            sub_category_id:
              item.sub_category_call_center?.id || GlobalVars.NullString,
            id: item.id,
            perform_date: item.perform_date,
            performers: item.performers?.id,
            response: item?.response,
            sended_to_organizations:
              item?.seded_to_Organization?.id || GlobalVars.NullString,
            status: item?.status || "Кўриб чиқиш жараёнида",
            email: item?.email,
            income_date: item?.income_date
              ? dayjs(new Date(item?.income_date)).format("DD-MM-YYYY HH:mm")
              : new Date(),

            organization_name: "",
            performer: "",
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
        district_id: GlobalVars.NullString,
        IsDraf: "",
        organization_type: GlobalVars.NullString,
        application_type: GlobalVars.NullString,
        applicant: "",
        phone: "",
        comment: "",
        resend_application: GlobalVars.NullString,
        sub_category_id: GlobalVars.NullString,
        id: "",
        perform_date: "",
        performers: "",
        response: GlobalVars.NullString,
        sended_to_organizations: GlobalVars.NullString,
        status: "Янги",
        email: "",
        income_date: new Date(),
        response_story: "",

        organization_name: "",
        performer: "",
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
                {...register("applicant", { required: disableRequireds })}
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
                {...register("applicant_birthday", {
                  required: disableRequireds,
                })}
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
                {...register("gender", { required: disableRequireds })}
              >
                <option value="">Танланг</option>
                <option value="Эркак">Эркак</option>
                <option value="Аёл">Аёл</option>
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
              <Input
                sx={inputStyle}
                as={InputMask}
                mask="+(999)99 999-99-99"
                {...register("phone")}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="additional_phone" sx={labelStyle}>
                Қўшимча телефон рақам
              </FormLabel>
              <Input
                sx={inputStyle}
                as={InputMask}
                mask="+(999)99 999-99-99"
                {...register("additional_phone")}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email" sx={labelStyle}>
                Электрон манзил
              </FormLabel>
              <Input
                sx={inputStyle}
                id="email"
                placeholder="example@gmail.com"
                type="email"
                {...register("email")}
              />
            </FormControl>
            <FormControl isInvalid={!!errors.region}>
              <FormLabel htmlFor="region" sx={labelStyle}>
                Вилоят
              </FormLabel>
              <AutocompleteSelect
                required={disableRequireds}
                name="region"
                control={control}
                options={[
                  { value: GlobalVars.NullString, label: "Барчаси" },
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
                required={disableRequireds}
                name="district_id"
                control={control}
                options={[
                  { value: GlobalVars.NullString, label: "Барчаси" },
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
                <option value={GlobalVars.NullString}>Танланг</option>
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
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  e.target.value === "Бошқа масалалар"
                    ? setDisableRequireds(false)
                    : setDisableRequireds(true)
                }
              >
                <option value={GlobalVars.NullString}>Танланг</option>
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
                required={disableRequireds}
                name="sub_category_id"
                control={control}
                options={[
                  { value: GlobalVars.NullString, label: "Барчаси" },
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
                <option value={GlobalVars.NullString}>Танланг</option>
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
                <FormLabel htmlFor="performers" sx={labelStyle}>
                  Ижрочи
                </FormLabel>
                <AutocompleteSelect
                  name="performers"
                  control={control}
                  options={[
                    { value: GlobalVars.NullString, label: "Барчаси" },
                    ...performers?.map((dist: any) => ({
                      value: dist.id,
                      label:
                        dist.title[0]?.toUpperCase() + dist?.title?.slice(1),
                    })),
                  ]}
                />
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
                <FormLabel htmlFor="sended_to_organizations" sx={labelStyle}>
                  Рахбарият
                </FormLabel>
                <AutocompleteSelect
                  name="sended_to_organizations"
                  control={control}
                  options={[
                    { value: GlobalVars.NullString, label: "Барчаси" },
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
                  <option value={GlobalVars.NullString}>Танланг</option>
                  {responseList.map((response) => (
                    <option key={response.id} value={response.label}>
                      {response.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            <FormControl>
              <FormLabel htmlFor="response_story" sx={labelStyle}>
                Мурожаатнинг якуний жавоб матни
              </FormLabel>
              <Textarea id="response_story" {...register("response_story")} />
            </FormControl>
            {role === "admin" ? (
              <FormControl>
                <FormLabel htmlFor="status" sx={labelStyle}>
                  Мурожаат холати
                </FormLabel>
                <Select
                  defaultValue={"Янги"}
                  sx={selectStyle}
                  id="status"
                  {...register("status")}
                >
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
