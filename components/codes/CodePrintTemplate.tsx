import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { Codes } from '@prisma/client';
import { formattedDate } from '@/utils/formattedDate';

const cmToPt = (cm: number) => cm / 2.54 * 72;

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
    width: cmToPt(7),
    height: cmToPt(2),
    marginBottom: cmToPt(0.2),
    marginHorizontal: cmToPt(0.3),
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
    <Page key={pageIndex} size={{ width: cmToPt(16), height:cmToPt(12) }} style={styles.page}>
      {codes
        .slice(pageIndex * codesPerPage, (pageIndex + 1) * codesPerPage)
        .map((code, index) => (
          <View key={index} style={styles.codeContainer}>
            <View style={{flexDirection:'column'}}>
            <Text style={styles.codeText}>{code.code}</Text>
            <Text style={styles.codeDescription}>{`Expiración: ${formattedDate(code.expires)}`}</Text>
            </View>
            <Image src={code.qrCode} />
          </View>
        ))}
    </Page>
  ));

  return <Document>{pagesArray}</Document>;
};
