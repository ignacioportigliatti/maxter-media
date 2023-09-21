import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Link,
  Rect,
  Font,
} from "@react-pdf/renderer";
import { Agency, Codes, Group } from "@prisma/client";

Font.register({
  family: "Poppins",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/poppins/v15/pxiByp8kv8JHgFVrLGT9Z1xlEA.ttf",
      fontStyle: "normal",
      fontWeight: "normal",
    },
  ],
});

// Define custom fonts
const Fonts = {
  primary: {
    normal: "Poppins",
    bold: "Helvetica-Bold",
  },
};

interface CodePdfTemplateProps {
  code: Codes;
  selectedGroup: Group;
  selectedAgency: Agency;
}

// Create styles

// Create Document Component
export const CodePdfTemplate = (props: CodePdfTemplateProps) => {
  const { code, selectedGroup, selectedAgency } = props;

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: (selectedAgency.secondaryColor as string) || "#cc6600",
      fontFamily: Fonts.primary.normal,
      padding: 10,
    },
    section: {
      padding: 10,
      flexGrow: 1,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: (selectedAgency.primaryColor as string) || "#4b4b4b",
      textAlign: "center",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    qrcode: {
      width: 100,
      height: 100,
      alignSelf: "center",
      marginVertical: 5,
    },
    agencyLogo: {
      backgroundColor: (selectedAgency.secondaryColor as string) || "#cc6600",
      borderRadius: 8,
      padding: 10,
      width: 64,
      height: 64,
      marginBottom: 10,
      alignSelf: "center",
    },
    h1: {
      backgroundColor: (selectedAgency.secondaryColor as string) || "#cc6600",
      padding: 10,
      borderRadius: 8,
      fontSize: 14,
      textTransform: "uppercase",
      fontWeight: "normal",
      color: (selectedAgency.accentColor as string) || "#fff",
    },
    h2: {
      fontSize: 10,
      lineHeight: 1.2,
      fontWeight: "bold",
      marginBottom: 10,
      maxWidth: 200,
      color: (selectedAgency.accentColor as string) || "#fff",
    },
    code: {
      fontSize: 12,
      lineHeight: 1.2,
      fontWeight: "bold",
      marginTop: 10,
      maxWidth: 200,
      color: (selectedAgency.accentColor as string) || "#fff",
    },
    p: {
      fontSize: 8,
      marginBottom: 5,
      color: (selectedAgency.accentColor as string) || "#fff",
      maxWidth: 200,
    },
    codeP: {
      fontSize: 8,
      color: (selectedAgency.accentColor as string) || "#fff",
      maxWidth: 200,
    },
    codeWeb: {
      fontSize: 8,
      fontWeight: "bold",
      color: (selectedAgency.accentColor as string) || "#fff",
      maxWidth: 200,
    },
    link: {
      backgroundColor: (selectedAgency.secondaryColor as string) || "#cc6600",
      padding: 8,
      borderRadius: 8,
      fontSize: 8,
      color: (selectedAgency.accentColor as string) || "#fff",
      textDecoration: "underline",
    },
    details: {
      border: `          1px solid ${
        (selectedAgency.accentColor as string) || "#fff"
      }`,
      backgroundColor: (selectedAgency.accentColor as string) || "#cc6600",
      borderTopWidth: 0,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 5,
      fontSize: 8,
      fontWeight: "bold",
      marginBottom: 5,
      color: (selectedAgency.secondaryColor as string) || "#cc6600",
    },
  });

  return (
    <Document title={code.code} author={selectedAgency.name}>
      <Page size={{ width: 288, height: 512 }} style={styles.page}>
        <View style={styles.section}>
          <Rect width={64} height={64}>
            <Image
              style={styles.agencyLogo}
              src={selectedAgency.logoSrc as string}
            />
          </Rect>
          <Text style={styles.h1}>Mi Viaje de Egresados 2023</Text>
          <Text style={styles.details}>
            Grupo: {selectedGroup.name} - Coordinador:{" "}
            {selectedGroup.coordinator}
          </Text>
          <Text style={styles.h2}>
            Ingresa a nuestro sistema para ver o descargar tus fotos y videos
            del viaje.
          </Text>
          <Text style={[styles.p, { marginTop: 5 }]}>
            A través del siguiente link:
          </Text>
          <Link
            style={styles.link}
            src={code.link}
          >
            Ver Mi Material
          </Link>
          <Text style={[styles.p, { marginTop: 10 }]}>
            O escaneando el código QR aquí debajo:
          </Text>
          <Image style={styles.qrcode} src={code.qrCode} />
          <Text style={styles.codeP}> También podés ir a </Text>
          <Text style={styles.codeWeb}> descargas.maxterproducciones.com</Text>
          <Text style={styles.codeP}>  e ingresar el siguiente código: </Text>
          <Text style={styles.code}>{code.code}</Text>
        </View>
      </Page>
    </Document>
  );
};
