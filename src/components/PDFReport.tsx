"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface Transaction {
    id: number;
    type: 'in' | 'out';
    quantity: string;
    unit: string;
    notes: string;
    createdAt: string;
    material: string;
    project: string;
    userName: string;
}

interface PDFReportProps {
    transactions: Transaction[];
    period: string;
}

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        borderBottomWidth: 2,
        borderBottomStyle: 'solid',
        borderBottomColor: '#e5e5e5',
        paddingBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#1f2937',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 3,
        color: '#374151',
    },
    period: {
        fontSize: 11,
        color: '#6b7280',
        marginBottom: 2,
    },
    generated: {
        fontSize: 9,
        color: '#9ca3af',
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        gap: 20,
    },
    summaryCard: {
        flex: 1,
        padding: 12,
        borderRadius: 6,
        textAlign: 'center',
    },
    summaryCardIn: {
        backgroundColor: '#f0f9f0',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#4ade80',
    },
    summaryCardOut: {
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#f87171',
    },
    summaryNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    summaryNumberIn: {
        color: '#16a34a',
    },
    summaryNumberOut: {
        color: '#dc2626',
    },
    summaryLabel: {
        fontSize: 9,
        color: '#6b7280',
    },
    tableHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#1f2937',
    },
    table: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#e5e5e5',
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableColHeader: {
        width: '14.28%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#e5e5e5',
        backgroundColor: '#f8f9fa',
        padding: 8,
    },
    tableCol: {
        width: '14.28%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#e5e5e5',
        padding: 6,
    },
    tableCellHeader: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#374151',
    },
    tableCell: {
        fontSize: 8,
        color: '#4b5563',
    },
    transactionIn: {
        borderLeftWidth: 3,
        borderLeftStyle: 'solid',
        borderLeftColor: '#16a34a',
    },
    transactionOut: {
        borderLeftWidth: 3,
        borderLeftStyle: 'solid',
        borderLeftColor: '#dc2626',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: '#9ca3af',
        borderTopWidth: 1,
        borderTopStyle: 'solid',
        borderTopColor: '#e5e5e5',
        paddingTop: 10,
    },
});

export const PDFReport: React.FC<PDFReportProps> = ({ transactions, period }) => {
    const inTransactions = transactions.filter(t => t.type === 'in');
    const outTransactions = transactions.filter(t => t.type === 'out');

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Laporan Transaksi Material</Text>
                    <Text style={styles.subtitle}>PIJAR PRO</Text>
                    <Text style={styles.period}>Periode: {period}</Text>
                    <Text style={styles.generated}>
                        Digenerate: {new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB
                    </Text>
                </View>

                {/* Summary */}
                <View style={styles.summary}>
                    <View style={[styles.summaryCard, styles.summaryCardIn]}>
                        <Text style={[styles.summaryNumber, styles.summaryNumberIn]}>
                            {inTransactions.length}
                        </Text>
                        <Text style={styles.summaryLabel}>Material Masuk</Text>
                    </View>
                    <View style={[styles.summaryCard, styles.summaryCardOut]}>
                        <Text style={[styles.summaryNumber, styles.summaryNumberOut]}>
                            {outTransactions.length}
                        </Text>
                        <Text style={styles.summaryLabel}>Material Keluar</Text>
                    </View>
                </View>

                {/* Table Header */}
                <Text style={styles.tableHeader}>Detail Transaksi</Text>

                {/* Table */}
                <View style={styles.table}>
                    {/* Table Header Row */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Waktu</Text>
                        </View>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Tipe</Text>
                        </View>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Material</Text>
                        </View>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Jumlah</Text>
                        </View>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Proyek</Text>
                        </View>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Operator</Text>
                        </View>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Catatan</Text>
                        </View>
                    </View>

                    {/* Table Data Rows */}
                    {transactions.map((transaction) => (
                        <View
                            key={transaction.id}
                            style={[
                                styles.tableRow,
                                transaction.type === 'in' ? styles.transactionIn : styles.transactionOut
                            ]}
                        >
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                    {formatDateTime(transaction.createdAt)}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                    {transaction.type === 'in' ? 'Masuk' : 'Keluar'}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{transaction.material}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                    {transaction.quantity} {transaction.unit}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{transaction.project}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{transaction.userName || '-'}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{transaction.notes || '-'}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Laporan ini digenerate otomatis oleh sistem PIJAR PRO</Text>
                    <Text>© 2025 PIJAR PRO - Sistem Pantau Material Konstruksi</Text>
                </View>
            </Page>
        </Document>
    );
};