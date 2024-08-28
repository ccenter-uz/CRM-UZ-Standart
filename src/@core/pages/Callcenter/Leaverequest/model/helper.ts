import { scssVariables } from "@/@core/application/utils/vars";

// STYLES
export const labelStyle = {
  color: scssVariables.textGreyColor,
  fontSize: scssVariables.fonts.parag,
  fontWeight: 400,
  marginTop: { base: "8px", sm: "8px", md: "16px", xl: "16px" },
};

export const inputStyle = {
  color: scssVariables.textGreyColor,
  fontSize: scssVariables.fonts.parag,
  fontWeight: 400,
  h: { base: "30px", sm: "30px", md: "40px", xl: "40px" },
  _focus: { boxShadow: "none", outline: scssVariables.primary },
  p: {
    base: "5px",
    sm: "5px",
    md: "16px",
    xl: "16px",
  },
  borderColor: "lightgrey",
};

export const selectStyle = {
  color: scssVariables.textGreyColor,
  fontSize: scssVariables.fonts.parag,
  fontWeight: 400,
  h: { base: "30px", sm: "30px", md: "40px", xl: "40px" },
  _focus: { boxShadow: "none", outline: scssVariables.primary },
  borderColor: "lightgrey",
};

export const buttonStyle = {
  w: {
    base: "100%",
    sm: "100%",
    md: "fit-content",
    xl: "fit-content",
  },
  h: { base: "30px", sm: "30px", md: "40px", xl: "40px" },
  fontSize: scssVariables.fonts.parag,
  fontWeight: 400,
  _hover: {
    background: scssVariables.primary,
    opacity: 0.8,
    transition: "opacity 0.2s linear",
  },
  bg: scssVariables.primary,
  color: "whitesmoke",
};

export const organizationTypeList = [
  {
    id: 1,
    label: "Юридик",
  },
  {
    id: 2,
    label: "Жисмоний шахс",
  },
];
export const applicationTypeList = [
  {
    id: 1,
    label: "Ариза",
  },
  {
    id: 2,
    label: "Таклиф",
  },
  {
    id: 3,
    label: "Шикоят",
  },
  {
    id: 4,
    label: "Маълумот бериш",
  },
  {
    id: 5,
    label: "Бошқа масалалар",
  }
];
export const resend_applicationList = [
  {
    id: 1,
    label: "Янги",
  },
  {
    id: 2,
    label: "Такрорий",
  },
];
export const responseList = [
  {
    id:0,
    label:"Тегишлилиги бўйича жўнатилган"
  },
  {
    id: 1,
    label: "Тушунтирилган",
  },
  {
    id: 2,
    label: "Қаноатлантирилган",
  },
  {
    id: 3,
    label: "Кўрмасдан қолдирилган",
  },
  {
    id: 4,
    label: "Аноним",
  },
];

export const statusList = [
  {
    id:"Янги",
    label:"Янги"
  },
  {
    id: "Кўриб чиқиш жараёнида",
    label: "Кўриб чиқиш жараёнида",
  },
  {
    id:"Кўриб чиқиш жараёни чўздирилган",
    label:"Кўриб чиқиш жараёни чўздирилган"
  },
  {
    id: "Кўриб чиқилган",
    label: "Кўриб чиқилган",
  },
]