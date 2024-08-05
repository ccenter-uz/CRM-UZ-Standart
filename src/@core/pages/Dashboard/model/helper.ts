import { scssVariables } from "@/@core/application/utils/vars";

// STYLES
export const labelStyle = {
  color: scssVariables.textGreyColor,
  fontSize: scssVariables.fonts.span,
  fontWeight: 400,
  marginTop: { base: "8px", sm: "8px", md: "16px", xl: "16px" },
};



export const buttonStyle = {
  w: {
    base: "100%",
    sm: "100%",
    md: "248px",
    xl: "248px",
  },
  h: { base: "30px", sm: "30px", md: "35px", xl: "35px" },
  fontSize: scssVariables.fonts.span,
  fontWeight: 400,
  _hover: {
    background: scssVariables.primary,
    opacity: 0.8,
    transition: "opacity 0.2s linear",
  },
  bg: scssVariables.primary,
  color: "whitesmoke",
};

// VARS
export const Dashboardcolumns = [
  {
    title: "№",
    dataIndex: "index",
    key: "index",
    width: 50,
    align: "center",
  },
  {
    title: "Вилоят",
    dataIndex: "region",
    key: "region",
  },
  {
    title: "Тасниф",
    dataIndex: "podrazdel",
    key: "podrazdel",
  },
  {
    title: "Келиб тушган мурожаатлар",
    dataIndex: "income",
    key: "income",
    render: (t: string) => (t ? t : 0) + " та",
  },
];
