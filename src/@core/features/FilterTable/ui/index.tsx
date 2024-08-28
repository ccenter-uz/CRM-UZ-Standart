import { scssVariables } from "@/@core/application/utils/vars";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { buttonStyle, inputStyle, labelStyle } from "../model/helper";
import { useGlobal } from "@/@core/application/store/global";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect } from "react";
import {
  applicationTypeList,
  responseList,
  statusList,
} from "@/@core/pages/Callcenter/Leaverequest/model/helper";
import AutocompleteSelect from "@/@core/shared/ui/Autocomplete";
import InputMask from "react-input-mask";
import { GlobalVars } from "@/@core/shared/vars";

type Props = {
  handleFinish: (data: any) => void;
  handleChangeRegion: (data: any) => void;
};

export const FilterTable: FC<Props> = (props) => {
  const { handleFinish, handleChangeRegion } = props;
  const params = useSearchParams();
  const {
    podrazdel,
    setPodrazdel,
    setDistrict,
    regions,
    district,
    operators,
    getPodrazdel,
    getDistrict,
  } = useGlobal();
  const { handleSubmit, register, reset, control } = useForm();
  const router = useRouter();

  // CLEAR
  const handleClear = async () => {
    setPodrazdel([]);
    setDistrict([]);
    reset({
      status: params.get("status") || GlobalVars.NullString,
      phone: "",
      applicant_birthday: "",
      income_number: "",
      district: GlobalVars.NullString,
      region: GlobalVars.NullString,
      subCategoryId: GlobalVars.NullString,
      date_from: GlobalVars.NullString,
      date_to: GlobalVars.NullString,
      response: GlobalVars.NullString,
      operators: GlobalVars.NullString,
      applicant: "",
      application_type: GlobalVars.NullString,
    });
    await Promise.all([getPodrazdel(), getDistrict()]);
    router.push(`?page=1&pageSize=10`);
  };

  useEffect(() => {
    setTimeout(() => {
      reset({
        status: params.get("status") || GlobalVars.NullString,
        phone: params.get("phone") || "",
        applicant_birthday: params.get("applicant_birthday") || "",
        applicant: params.get("applicant") || "",
        operators: params.get("operators") || GlobalVars.NullString,
        response: params.get("response") || GlobalVars.NullString,
        income_number:
          params.get("income_number") === GlobalVars.NullString
            ? ""
            : params.get("income_number"),
        region: params.get("region") || GlobalVars.NullString,
        district: params.get("district") || GlobalVars.NullString,
        subCategoryId: params.get("subCategoryId") || GlobalVars.NullString,
        application_type:
          params.get("application_type") || GlobalVars.NullString,
        date_from: params.get("date_from") || GlobalVars.NullString,
        date_to: params.get("date_to") || GlobalVars.NullString,
      });
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={handleSubmit(handleFinish)} id="filter-callcenter">
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, xl: 6 }}
        my={"8px"}
        alignItems={"flex-end"}
        justifyContent={"space-between"}
        gap={"8px"}
        borderTop={"1px solid lightgrey"}
      >
        <FormControl>
          <FormLabel htmlFor="income_number" sx={labelStyle}>
            Мурожаат рақами:
          </FormLabel>
          <Input
            sx={inputStyle}
            id="income_number"
            {...register("income_number")}
            placeholder="UZST/1"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="phone" sx={labelStyle}>
            Телефон рақам:
          </FormLabel>
          <Input
            as={InputMask}
            sx={inputStyle}
            mask="+(998)99 999-99-99"
            id="phone"
            {...register("phone")}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="applicant_birthday" sx={labelStyle}>
            Туғиланган санаси:
          </FormLabel>
          <Input
            sx={inputStyle}
            id="applicant_birthday"
            type="date"
            {...register("applicant_birthday")}
            placeholder="998971234567"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="applicant" sx={labelStyle}>
            Аризачи Ф.И.Ш:
          </FormLabel>
          <Input
            sx={inputStyle}
            id="applicant"
            {...register("applicant")}
            placeholder="Ф.И.Ш"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="operators" sx={labelStyle}>
            Операторлар
          </FormLabel>
          <AutocompleteSelect
            name="operators"
            control={control}
            options={[
              { value: GlobalVars.NullString, label: "Барчаси" },
              ...operators?.map((field: any) => ({
                value: field.id,
                label: field?.full_name,
              })),
            ]}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="response" sx={labelStyle}>
            Мурожаатни жавоби
          </FormLabel>
          <AutocompleteSelect
            name="response"
            control={control}
            options={[
              { value: GlobalVars.NullString, label: "Барчаси" },
              ...responseList?.map((field: any) => ({
                value: field.label,
                label: field.label,
              })),
            ]}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="region" sx={labelStyle}>
            Вилоят:
          </FormLabel>
          <AutocompleteSelect
            name="region"
            control={control}
            options={[
              { value: GlobalVars.NullString, label: "Барчаси" },
              ...regions?.map((region: any) => ({
                value: region.id,
                label: region.title[0].toUpperCase() + region.title.slice(1),
              })),
            ]}
            onChange={handleChangeRegion}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="district" sx={labelStyle}>
            Туман:
          </FormLabel>
          <AutocompleteSelect
            name="district"
            control={control}
            options={[
              { value: GlobalVars.NullString, label: "Барчаси" },
              ...district?.map((dist: any) => ({
                value: dist.id,
                label: dist.title,
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
              { value: GlobalVars.NullString, label: "Барчаси" },
              ...podrazdel?.map((field: any) => ({
                value: field.id,
                label: field.title,
              })),
            ]}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="application_type" sx={labelStyle}>
            Мурожаат тури
          </FormLabel>
          <AutocompleteSelect
            name="application_type"
            control={control}
            options={[
              { value: GlobalVars.NullString, label: "Барчаси" },
              ...applicationTypeList?.map((field: any) => ({
                value: field.label,
                label: field.label,
              })),
            ]}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="status" sx={labelStyle}>
            Мурожаат холати
          </FormLabel>
          <AutocompleteSelect
            name="status"
            control={control}
            options={[
              { value: GlobalVars.NullString, label: "Барчаси" },
              ...statusList?.map((field: any) => ({
                value: field.label,
                label: field.label,
              })),
            ]}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="date_from" sx={labelStyle}>
            Бошланиш санаси:
          </FormLabel>
          <Input
            type="date"
            id="date_from"
            sx={inputStyle}
            {...register("date_from")}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="date_to" sx={labelStyle}>
            Тугаш санаси:
          </FormLabel>
          <Input
            type="date"
            id="date_to"
            sx={inputStyle}
            {...register("date_to")}
          />
        </FormControl>
      </SimpleGrid>
      <Flex align={"center"} gap={"8px"} mb={"8px"} justifyContent={"flex-end"}>
        <Button
          variant={"outline"}
          sx={{
            w: {
              base: "100%",
              sm: "100%",
              md: "248px",
              xl: "248px",
            },
            h: { base: "30px", sm: "30px", md: "35px", xl: "35px" },
            borderColor: scssVariables.primary,
            color: scssVariables.primary,
            fontSize: scssVariables.fonts.span,
            fontWeight: 400,
          }}
          onClick={handleClear}
        >
          Тозалаш
        </Button>
        <Button sx={buttonStyle} type="submit" form="filter-callcenter">
          Қидириш
        </Button>
      </Flex>
    </form>
  );
};
