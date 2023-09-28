import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image, Font } from '@react-pdf/renderer';
import { Codes } from '@prisma/client';
import { formattedDate } from '@/utils/formattedDate';

Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 }
  ]
})

const cmToPt = (cm: number) => cm / 2.54 * 72;

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Open Sans',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 0.6 / 2.54 * 72,
    marginLeft: 0.6 / 2.54 * 72,
    marginRight: 0.6 / 2.54 * 72,
  },
  codeContainer: {
    padding: 0.2 / 2.54 * 72,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: cmToPt(7),
    height: cmToPt(2),
    marginBottom: cmToPt(0.3),
    marginHorizontal: cmToPt(0.3),
  },
  codeText: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 700,
  },
  codeDescription: {
    fontSize: 7,
    textAlign: 'left',
  },
  webLink: {
    fontSize: 7,
    textAlign: 'left',
    fontWeight: 700,

  },
  qrCode: {
    width: cmToPt(1.5),
    height: cmToPt(1.5),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

interface CodePrintTemplateProps {
  codes: Codes[];
}

export const CodePrintTemplate = (props: CodePrintTemplateProps) => {
  const { codes } = props;
  const codesPerPage = 10; // Número máximo de códigos por página

  const pages = Math.ceil(codes.length / codesPerPage);

  

  const pagesArray = Array.from({ length: pages }, (_, pageIndex) => (
    <Page key={pageIndex} size={{ width: cmToPt(16.087), height:cmToPt(12.7) }} style={styles.page}>
      {codes
        .slice(pageIndex * codesPerPage, (pageIndex + 1) * codesPerPage)
        .map((code, index) => (
          <View key={index} style={styles.codeContainer}>
            <View style={{flexDirection:'column', columnGap: 0}}>
            <Text style={styles.codeDescription}>Ingresa el siguiente codigo en</Text>
            <Text style={styles.webLink}>descargas.maxterproducciones.com.ar</Text>
            <Text style={styles.codeText}>{code.code}</Text>
            <Text style={styles.codeDescription}>{`Expiración: ${formattedDate(code.expires)} - Acceso a: ${
              code.type === 'full' ? 'Fotos y Videos' : code.type === 'photo' ? 'Fotos' : 'Videos'
            }`}</Text>
            </View>
            <Image src={code.qrCode} />
          </View>
        ))}
    </Page>
  ));

  return <Document>{pagesArray}</Document>;
};
