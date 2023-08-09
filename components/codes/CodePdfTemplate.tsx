import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Link,
  } from "@react-pdf/renderer";
  import { Agency, Codes, Group } from "@prisma/client";
  
  // Define custom fonts
  const Fonts = {
    primary: {
      normal: "Helvetica",
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
        backgroundColor: selectedAgency.primaryColor as string || "#cc6600",
        fontFamily: Fonts.primary.normal,
        padding: 10,
      },
      section: {
        padding: 10,
        flexGrow: 1,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: selectedAgency.secondaryColor as string || "#4b4b4b",
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
        width: 64,
        height: 64,
        marginBottom: 10,
        alignSelf: "center",
      },
      h1: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: selectedAgency.accentColor as string || "#fff",
      },
      h2: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
        color: selectedAgency.accentColor as string || "#fff",
      },
      p: {
        fontSize: 10,
        marginBottom: 5,
        color: selectedAgency.accentColor as string || "#fff",
      },
      link: {
        fontSize: 10,
        color: selectedAgency.accentColor as string || "#fff",
        textDecoration: "underline",
      },
      details: {
          fontSize: 10,
          fontWeight: "bold",
          marginBottom: 5,
          color: selectedAgency.accentColor as string || "#fff",
      }
    });

    return (
      <Document title={code.code} author={selectedAgency.name}>
        <Page size={{ width: 288, height: 512 }} style={styles.page}>
          <View style={styles.section}>
            <Image
              style={styles.agencyLogo} 
              src={selectedAgency.logoSrc as string}
            />
            <Text style={styles.h1}>Mi Viaje de Egresados 2023</Text>
            <Text style={styles.details}>
              Escuela: {selectedGroup.school} - Coordinador:{" "}
              {selectedGroup.coordinator}
            </Text>
            <Text style={styles.h2}>
              Ingresa a nuestro sistema para ver o descargar tus fotos y videos
              del viaje.
            </Text>
            <Text style={[styles.p, { marginTop: 5 }]}>
              Ingresando a través del siguiente link:
            </Text>
            <Link
              style={styles.link}
              src={`http://localhost:3000/client?code=${code.code}`}
            >
              Ver Mi Material
            </Link>
            <Text style={[styles.p, { marginTop: 10 }]}>
              O escaneando el código QR aquí debajo:
            </Text>
            <Image style={styles.qrcode} src={code.qrCode} />
            <Text style={styles.p}>
              También puedes ingresar a descargas.maxterproducciones.com e ingresar
              el siguiente código:
            </Text>
            <Text style={styles.h2}>{code.code}</Text>
          </View>
        </Page>
      </Document>
    );
  };
  