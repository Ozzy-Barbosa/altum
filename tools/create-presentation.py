"""Build the printable sales folder from the same catalog used by the website.

Requires reportlab. First export src/data/catalog.ts to tmp/pdfs/catalog.json.
"""
import json
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT/'tmp/pdfs/catalog.json').read_text(encoding='utf-8'))
FONT_DIR = Path('C:/Windows/Fonts')
pdfmetrics.registerFont(TTFont('AltumBody', str(FONT_DIR/'arial.ttf')))
pdfmetrics.registerFont(TTFont('AltumBold', str(FONT_DIR/'arialbd.ttf')))
W,H = A4
NAVY, BLUE, MUTED, LINE = map(HexColor, ['#0c1930','#176fce','#526278','#dae3ef'])
OUTPUT = ROOT/'output/pdf/altum-presentacion-comercial.pdf'
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
c = canvas.Canvas(str(OUTPUT), pagesize=A4)
c.setTitle('Altum | Soluciones digitales para negocios en La Paz')
c.setAuthor('Altum Soluciones Digitales')

def para(text, x, top, width, size=11, color=MUTED, bold=False, leading=None):
    style=ParagraphStyle('p',fontName='AltumBold' if bold else 'AltumBody',fontSize=size,
        leading=leading or size*1.5,textColor=color,spaceAfter=0)
    p=Paragraph(text,style)
    _,height=p.wrap(width,H)
    p.drawOn(c,x,H-top-height)
    return top+height

def qr(url,x,top,size=90):
    widget=QrCodeWidget(url,barLevel='M')
    x0,y0,x1,y1=widget.getBounds()
    d=Drawing(size,size,transform=[size/(x1-x0),0,0,size/(y1-y0),0,0])
    d.add(widget)
    renderPDF.draw(d,c,x,H-top-size)
    c.linkURL(url,(x,H-top-size,x+size,H-top),relative=0)

def line(y):
    c.setStrokeColor(LINE);c.line(42,H-y,W-42,H-y)

def header(label):
    c.setFillColor(NAVY);c.rect(0,H-93,W,93,fill=1,stroke=0)
    c.drawImage(str(ROOT/'public/assets/logo-altum-symbol-transparent.png'),39,H-61,
        width=58,height=31,mask='auto',preserveAspectRatio=True)
    para('ALTUM',108,28,200,20,white,True)
    para('SOLUCIONES DIGITALES',109,56,220,7,HexColor('#a8c3e8'),True)
    para(label,W-230,41,188,8,white,False)

def footer(page):
    line(786)
    para('www.altumlapaz.com  |  +52 612 212 5198',42,799,445,9,NAVY,True)
    para(f'{page:02d} / {1 + (len(data["solutions"])+1)//2:02d}',W-95,799,60,8,MUTED)

header('LA PAZ, BAJA CALIFORNIA SUR')
para('TU NEGOCIO, EN DIGITAL',42,123,W-84,9,BLUE,True)
para('Tu negocio.<br/>Su siguiente gran versión.',42,150,W-84,32,NAVY,True,37)
para('Páginas web, tiendas y herramientas que ayudan a presentar tus servicios, atender clientes y organizar tu operación.',42,249,W-100,12,MUTED)
for i,s in enumerate(data['solutions']):
    col,row=i%2,i//2
    x,y=42+col*265,320+row*48
    para(s['label'],x,y,240,11,NAVY,True)
    para(s['headline'],x,y+19,245,8.5,MUTED)
line(574)
para('Un proyecto claro, desde el inicio.',42,594,450,16,NAVY,True)
para('Conocemos tu negocio. Definimos el alcance. Diseñamos y desarrollamos. Publicamos y te acompañamos.',42,626,350,10,MUTED)
para('Prueba las diez demos.',42,686,340,15,BLUE,True)
para('Escanea el código con tu celular.<br/>Sin registro. Con información de ejemplo.',42,715,340,10,MUTED)
qr(data['site']['origin']+'/demos/',W-145,677,104)
footer(1);c.showPage()

for page,pair in enumerate([range(i,min(i+2,len(data['solutions']))) for i in range(0,len(data['solutions']),2)],start=2):
    header('HERRAMIENTAS QUE PUEDES PROBAR')
    for position,index in enumerate(pair):
        s=data['solutions'][index]
        top=122+position*287
        accent=HexColor(s['color'])
        c.setFillColor(accent);c.roundRect(42,H-top-5,28,4,2,fill=1,stroke=0)
        y=para(s['label'],42,top+15,390,22,NAVY,True)
        y=para(s['headline'],42,y+6,390,12,BLUE,True)
        y=para(s['description'],42,y+11,365,10,MUTED)
        y=para('<b>Para:</b> '+escape(s['audience']),42,y+9,365,9,NAVY)
        for feature in s['features']:
            y=para('• '+escape(feature),46,y+4,358,9,MUTED)
        y=para('<b>Prueba:</b> '+escape(s['demo']),42,y+9,365,9,NAVY)
        if y>top+272: raise ValueError(f'Content exceeds product block: {s["name"]}, {y}')
        qr(data['site']['origin']+'/demos/'+s['slug']+'/',W-139,top+90,97)
        para(s['name']+'<br/>Escanea y prueba',W-137,top+190,96,8,MUTED)
        line(top+277)
    para('Adaptamos esta base a tu negocio.',42,710,465,13,NAVY,True)
    para('Identidad, contenido, operación e integraciones según el alcance acordado. Cotización personalizada.',42,738,465,9,MUTED)
    para('Datos ficticios. Sin cobros, pedidos ni reservas reales. Costos externos según propuesta.',42,773,470,7,MUTED)
    footer(page);c.showPage()
c.save()
print(OUTPUT)
