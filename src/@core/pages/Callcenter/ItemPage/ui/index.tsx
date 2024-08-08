"use client";
import { FC, useEffect, useRef } from "react";
import { useItemPage } from "../model/Slicer";
import { useParams, useRouter } from "next/navigation";
import { Box, Button, Divider, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { PaperContent } from "@/@core/shared/ui/PaperContent";
import BreadCrumb from "@/@core/shared/ui/Breadcrumb";
import { Download, PenTool } from "react-feather";
import { scssVariables } from "@/@core/application/utils/vars";
import { EditHistorydrawer } from "./EditHistoryDrawer";
import { useDisclosure } from "@/@core/shared/hook/useDisclosure";
import { Word } from "./Word";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const Itempage: FC = () => {
  const query = useParams();
  const router = useRouter();
  const { data, getData } = useItemPage();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const wordRef = useRef<any>();
  const iframeRef = useRef<any>();
  const breadcrumb = [
    {
      id: 1,
      title: (
        <Button
          variant={"unstyled"}
          fontWeight={400}
          fontSize={{ base: "10px", sm: "10px", md: "14px", xl: "14px" }}
          onClick={() => router.back()}
        >
          {"<- Ортга"}
        </Button>
      ),
    },
    {
      id: 2,
      title: "Мурожаат",
    },
    {
      id: 3,
      title: `№-${data[0]?.incoming_number}`,
    },
  ];

  // WORD DOWNLOAD
  const wordDownload = async () => {
    const element = wordRef.current;
    const canvas = await html2canvas(element, {
      scale: 1.5, // Adjust the scale for balance between quality and performance
      useCORS: true, // Allow cross-origin images
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Adjust the height to fit A4 format
    const pageHeight = pdf.internal.pageSize.getHeight();
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const iframe = iframeRef.current;

    iframe.src = pdfUrl;
    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    };
    pdf.save(`№-${data[0]?.incoming_number}.pdf`);
  };

  useEffect(() => {
    getData(query?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.id]);

  return (
    <Box
      p={{ base: "5px 10px", sm: "5px 10px", md: "8px 16px", xl: "8px 16px" }}
    >
      <BreadCrumb item={breadcrumb} />
      <Flex
        align={"center"}
        gap={"10px"}
        justify={"flex-end"}
        flexWrap={"wrap"}
      >
        <Button
          h={{ base: "30px", sm: "30px", md: "35px", xl: "35px" }}
          leftIcon={<Download width={"16px"} height={"16px"} />}
          fontSize={scssVariables.fonts.parag}
          onClick={wordDownload}
          fontWeight={400}
          variant={"outline"}
          color={"orange.400"}
          borderColor={"orange.400"}
          _hover={{ bg: "orange.400", color: "white" }}
        >
          PDF юклаш
        </Button>
        <Button
          h={{ base: "30px", sm: "30px", md: "35px", xl: "35px" }}
          leftIcon={<PenTool width={"16px"} height={"16px"} />}
          fontSize={scssVariables.fonts.parag}
          onClick={onOpen}
          fontWeight={400}
          variant={"outline"}
          color={"green.400"}
          borderColor={"green.400"}
          _hover={{ bg: "green.400", color: "white" }}
        >
          Ўзгартириш тарихи
        </Button>
      </Flex>
      {/* CONTENT */}
      <iframe ref={iframeRef} style={{ display: "none" }}></iframe>
      <SimpleGrid
        columns={{ base: 1, sm: 1, md: 1, xl: 2 }}
        gap={"24px"}
        mt={"16px"}
        alignItems={"flex-start"}
      >
        {/* LEFT */}
        <Word data={data} ref={wordRef} />
        {/* RIGHT */}
        <Box
          bg={"#fff"}
          p={"24px"}
          borderRadius={"8px"}
          boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.02)"}
        >
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>№</th>
                <th>Qo'shimcha Ma'lumotlar</th>
                <th>Tafsilotlar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Ijrochi</td>
                <td>{data[0]?.performers?.title || "Маълумот йўқ"}</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Ijro qilingan sana</td>
                <td>{data[0]?.perform_date || "Маълумот йўқ"}</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Rahbariyat</td>
                <td>
                  {data[0]?.seded_to_Organization?.title[0].toUpperCase() +
                    data[0]?.seded_to_Organization?.title.slice(1) ||
                    "Маълумот йўқ"}
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>Murojaat javobi</td>
                <td>{data[0]?.response || "Маълумот йўқ"}</td>
              </tr>
            </tbody>
          </table>
        </Box>
      </SimpleGrid>
      {/* Drawer */}
      <EditHistorydrawer isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};
