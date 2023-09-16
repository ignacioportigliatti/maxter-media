import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { Codes } from '@prisma/client';
import { formattedDate } from '@/utils/formattedDate';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 0.6 / 2.54 * 72,
  },
  codeContainer: {
    padding: 0.2 / 2.54 * 72,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: 7 / 2.54 * 72,
    height: 2 / 2.54 * 72,
    marginBottom: 0.2 / 2.54 * 72,
    marginRight: 0.3 / 2.54 * 72,
    marginLeft: 0.3 / 2.54 * 72,
  },
  codeText: {
    fontSize: 10,
    textAlign: 'center',
  },
  codeDescription: {
    fontSize: 7,
    textAlign: 'center',
  },
  qrCode: {
    width: 1.5 / 2.54 * 72,
    height: 1.5 / 2.54 * 72,
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
    <Page key={pageIndex} size={{ width: 16 / 2.54 * 72, height: 12 / 2.54 * 72 }} style={styles.page}>
      {codes
        .slice(pageIndex * codesPerPage, (pageIndex + 1) * codesPerPage)
        .map((code, index) => (
          <View key={index} style={styles.codeContainer}>
            <View style={{flexDirection:'column'}}>
            <Text style={styles.codeText}>{code.code}</Text>
            <Text style={styles.codeDescription}>{`Expiracion: ${formattedDate(code.expires)}`}</Text>
            </View>
            <Image src={code.qrCode} />
          </View>
        ))}
    </Page>
  ));

  return <Document>{pagesArray}</Document>;
};
