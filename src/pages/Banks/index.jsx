import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Document, Packer, Paragraph, Table as DocTable, TableCell as DocTableCell, TableRow as DocTableRow } from 'docx'
import { openDB } from 'idb'
import { Typography, Button } from '@mui/material';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import jsPDF from 'jspdf';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';

import { banksOperations, banksSelectors } from '../../redux/banks';
import AddBankModal from '../Modal';



function Banks() {
  const banks = useSelector(banksSelectors.getAllBanks);
  const dispatch = useDispatch();
  const isLoading = useSelector(banksSelectors.getLoading);

  const [showModal, setShowModal] = useState(false)
  const [indexedDBBanks, setIndexedDBBanks] = useState([])

  useEffect(() => {
    dispatch(banksOperations.fetchBanks());

    const fetchIndexedDBBanks = async () => {
      const db = await openDB('banksDB', 1);
      const allBanks = await db.getAll('banks');
      setIndexedDBBanks(allBanks);
    }

    fetchIndexedDBBanks();
  }, [dispatch]);

  const allBanks = [...banks, ...indexedDBBanks];

  const handleOpen = () => {
    setShowModal(true);     
   };

   const handleClose = () => {
    setShowModal(false);
  };

  const generateDoc = () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Bank list",
              heading: "Headings",
            }),
            new DocTable({
              rows: [
                new DocTableRow({
                  children: [
                    new DocTableCell({children: [new Paragraph("Bank name")]}),
                    new DocTableCell({children: [new Paragraph("Interest rate (%)")]}),
                    new DocTableCell({children: [new Paragraph("Maximum loan ($)")]}),
                    new DocTableCell({children: [new Paragraph("Minimum down payment ($)")]}),
                    new DocTableCell({children: [new Paragraph("Loan term (m)")]}),
                  ],
                }),
                ...banks.map((bank) => 
                  new DocTableRow({
                    children: [
                      new DocTableCell({children: [new Paragraph(bank.BankName)]}),
                      new DocTableCell({children: [new Paragraph(bank.InterestRate.toString())]}),
                      new DocTableCell({children: [new Paragraph(bank.MaximumLoan.toString())]}),
                      new DocTableCell({children: [new Paragraph(bank.MinimumDownPayment.toString())]}),
                      new DocTableCell({children: [new Paragraph(bank.LoanTerm.toString())]}),
                    ]
                  })
                )
              ]
            })
          ]
        }
      ]
    });

    Packer.toBlob(doc).then((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = "BankList.docx";
      link.click();
    })
  }

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Banks List', 10, 10);

    let startY = 20;
    banks.forEach((bank, index) => {
      doc.text(`${index + 1}. ${bank.BankName}`, 10, startY);
      doc.text(`Interest rate (%): ${bank.InterestRate}`, 10, startY + 10);
      doc.text(`Maximum loan ($): ${bank.MaximumLoan}`, 10, startY + 20);
      doc.text(`Minimum down payment ($): ${bank.MinimumDownPayment}`, 10, startY + 30);
      doc.text(`Loan term (m): ${bank.LoanTerm}`, 10, startY + 40);
      startY += 50;
    });

    doc.save('BanksList.pdf');
  };

  return (
        <>
          <Box display="flex" justifyContent="space-between"  >
              <IconButton sx={{ m:2 }} onClick={handleOpen}>
                <AddCircleOutlineIcon color="primary"/>
                <Typography color='primary'>Add new Bank</Typography>
              </IconButton>
              <IconButton sx={{ m:2 }} onClick={handleOpen}>
                <Typography color='primary'>Currencies</Typography>
              </IconButton>
          </Box>


          {showModal && <AddBankModal onClose={handleClose} />}
          {isLoading && 
              <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
            }  

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ border: 2 }}>
              <TableRow >
                <TableCell sx={{ fontWeight: 'bold' }}>Bank name</TableCell>
                <TableCell  sx={{ fontWeight: 'bold' }} align="right" >Interest rate&nbsp;(%)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Maximum loan&nbsp;($)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Minimum down payment&nbsp;($)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Loan term&nbsp;(m)</TableCell>
              </TableRow>
            </TableHead>
            
            {allBanks.length > 0 && (
              <TableBody>
                {allBanks.map(({ id, BankName, InterestRate, MaximumLoan, MinimumDownPayment, LoanTerm }) => (
                  <TableRow
                  key={id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell component="th" scope="e">
                    {BankName}
                  </TableCell>
                  <TableCell align="right">{InterestRate}</TableCell>
                  <TableCell align="right">{MaximumLoan}</TableCell>
                  <TableCell align="right">{MinimumDownPayment}</TableCell>
                  <TableCell align="right">{LoanTerm}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => dispatch(banksOperations.deleteBank(id))}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            )}
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="end" m={2}>
          <Button variant="contained" color="primary" onClick={generateDoc}>
            Generate DOCX
          </Button>
          <Button variant="contained" color="primary" onClick={generatePDF} sx={{ ml: 2 }}>
            Generate PDF
          </Button>
        </Box>

        </>
      )
}

export default Banks