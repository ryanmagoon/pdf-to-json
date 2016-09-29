const fs = require('fs'),
    express = require('express'),
    path = require('path'),
    formidable = require('formidable'),
    PDFParser = require('pdf2json')

let app = express()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'))
})

app.get('/view', (req, res) => {
    let pdfParser = new PDFParser()
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
        fs.writeFile('./fields.json', JSON.stringify(pdfData))
        fs.readFile('./fields.json', (err, file) => {
            res.writeHead(200, {'content-type': 'application/json'})
            res.write(file, 'binary')
            res.end()
        })
    })
    pdfParser.loadPDF('./temp.pdf')
})

app.post('/upload', (req, res) => {
  // req.body will contain the parsed body
  // parse a file upload
    let form = new formidable.IncomingForm()

    form.parse(req, function(err, fields, files) {
        fs.rename(files['files[]'].path, './temp.pdf')
        res.writeHead(200, {'content-type': 'text/html'})
        res.write('Received upload: <a href="/view">View PDF</a>')
        res.end()
    })
})

app.listen(3000, () => console.log('app running on port 3000!'))
