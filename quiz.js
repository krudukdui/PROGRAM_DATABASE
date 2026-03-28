// ============================================================
// QUIZ.JS — ข้อสอบ 6 หน่วย + Engine ควบคุมการทำข้อสอบ
// N8N_WEBHOOK_URL: เปลี่ยนเป็น URL จริงของคุณ
// ============================================================

const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/quiz-result';
const PASS_PERCENT = 70; // เกณฑ์ผ่าน 70%

// ============================================================
// QUIZ BANK — คลังข้อสอบ 6 หน่วย (หน่วยละ 10 ข้อ)
// แต่ละข้อ: { q, choices, answer (index 0-based), explain }
// ============================================================
const QUIZ_BANK = {
  1: {
    title: 'หน่วยที่ 1: ความรู้เบื้องต้นเกี่ยวกับฐานข้อมูล',
    questions: [
      {
        q: 'ฐานข้อมูล (Database) คืออะไร?',
        choices: [
          'โปรแกรมสำหรับพิมพ์เอกสาร',
          'การจัดเก็บข้อมูลอย่างเป็นระบบและมีความสัมพันธ์กัน',
          'ระบบปฏิบัติการของคอมพิวเตอร์',
          'อุปกรณ์จัดเก็บข้อมูลฮาร์ดแวร์'
        ],
        answer: 1,
        explain: 'ฐานข้อมูลคือการรวบรวมข้อมูลที่มีโครงสร้าง จัดเก็บอย่างเป็นระบบเพื่อให้เรียกใช้ได้สะดวก'
      },
      {
        q: 'DBMS ย่อมาจากอะไร?',
        choices: [
          'Database Management System',
          'Digital Backup Management Software',
          'Data Binary Master Server',
          'Document Based Management System'
        ],
        answer: 0,
        explain: 'DBMS = Database Management System คือซอฟต์แวร์ที่ใช้จัดการฐานข้อมูล เช่น MySQL, MS Access'
      },
      {
        q: 'ข้อใดคือตัวอย่างของ DBMS?',
        choices: [
          'Microsoft Word',
          'Adobe Photoshop',
          'MySQL',
          'Google Chrome'
        ],
        answer: 2,
        explain: 'MySQL เป็น DBMS ยอดนิยมที่ใช้จัดการฐานข้อมูลเชิงสัมพันธ์'
      },
      {
        q: 'ข้อมูล (Data) และสารสนเทศ (Information) ต่างกันอย่างไร?',
        choices: [
          'ไม่ต่างกันเลย',
          'ข้อมูลคือข้อเท็จจริงดิบ สารสนเทศคือข้อมูลที่ผ่านการประมวลผลแล้ว',
          'สารสนเทศคือข้อเท็จจริงดิบ ข้อมูลคือสิ่งที่ผ่านการประมวลผล',
          'ข้อมูลมีขนาดใหญ่กว่าสารสนเทศเสมอ'
        ],
        answer: 1,
        explain: 'Data คือข้อเท็จจริงดิบที่ยังไม่ผ่านการประมวลผล ส่วน Information คือผลลัพธ์หลังจากประมวลผลแล้วมีความหมาย'
      },
      {
        q: 'Field ในฐานข้อมูลหมายถึงอะไร?',
        choices: [
          'ตารางทั้งหมดในฐานข้อมูล',
          'แถวหนึ่งแถวในตาราง',
          'คอลัมน์หนึ่งคอลัมน์ที่เก็บข้อมูลประเภทเดียวกัน',
          'ชื่อของฐานข้อมูล'
        ],
        answer: 2,
        explain: 'Field คือ "คอลัมน์" ในตาราง เช่น Field ชื่อ "ชื่อนักเรียน" เก็บข้อมูลชื่อของนักเรียนทุกคน'
      },
      {
        q: 'Record ในฐานข้อมูลหมายถึงอะไร?',
        choices: [
          'แถวหนึ่งแถวที่รวมข้อมูลของ Field ทั้งหมดสำหรับรายการหนึ่ง',
          'คอลัมน์ในตาราง',
          'ชื่อของตาราง',
          'Primary Key'
        ],
        answer: 0,
        explain: 'Record คือ "แถว" ในตาราง แทนข้อมูลครบชุดหนึ่งรายการ เช่น ข้อมูลนักเรียน 1 คน'
      },
      {
        q: 'Primary Key คืออะไร?',
        choices: [
          'รหัสผ่านของฐานข้อมูล',
          'Field ที่มีค่าไม่ซ้ำกัน ใช้ระบุแต่ละ Record อย่างเฉพาะเจาะจง',
          'ชื่อของตารางหลัก',
          'Field แรกของตารางเสมอ'
        ],
        answer: 1,
        explain: 'Primary Key คือ Field ที่ค่าไม่ซ้ำกัน (Unique) และไม่เป็น NULL ใช้ระบุ Record แต่ละรายการ'
      },
      {
        q: 'ฐานข้อมูลเชิงสัมพันธ์ (Relational Database) มีลักษณะอย่างไร?',
        choices: [
          'จัดเก็บข้อมูลเป็น XML เท่านั้น',
          'จัดเก็บข้อมูลในรูปแบบตาราง มีความสัมพันธ์ระหว่างตาราง',
          'ไม่สามารถสืบค้นข้อมูลได้',
          'ใช้ได้กับระบบ Unix เท่านั้น'
        ],
        answer: 1,
        explain: 'Relational Database จัดเก็บข้อมูลในรูปตาราง (Table) และสามารถสร้างความสัมพันธ์ระหว่างตารางได้'
      },
      {
        q: 'ข้อดีของการใช้ฐานข้อมูลเปรียบเทียบกับการใช้ไฟล์ธรรมดาคืออะไร?',
        choices: [
          'ฐานข้อมูลใช้พื้นที่จัดเก็บน้อยกว่าเสมอ',
          'ลดการซ้ำซ้อนของข้อมูล จัดการง่าย ปลอดภัยกว่า',
          'ฐานข้อมูลทำงานได้เร็วกว่าเสมอในทุกกรณี',
          'ฐานข้อมูลไม่ต้องการโปรแกรมพิเศษ'
        ],
        answer: 1,
        explain: 'ข้อดีหลักของ DB: ลดความซ้ำซ้อน (Redundancy), มีระบบรักษาความปลอดภัย, รองรับหลายผู้ใช้พร้อมกัน'
      },
      {
        q: 'NULL ในฐานข้อมูลหมายความว่าอย่างไร?',
        choices: [
          'ค่าเป็นศูนย์ (0)',
          'ค่าว่างเปล่า ("")',
          'ไม่มีข้อมูล หรือค่าที่ไม่รู้จัก',
          'ค่าที่เป็น False'
        ],
        answer: 2,
        explain: 'NULL หมายถึง "ไม่มีค่า" หรือ "ไม่รู้ค่า" ซึ่งต่างจาก 0 หรือ ""'
      }
    ]
  },
  2: {
    title: 'หน่วยที่ 2: การออกแบบฐานข้อมูล',
    questions: [
      {
        q: 'ERD ย่อมาจากอะไร?',
        choices: [
          'Entity Relation Diagram',
          'Entity Relationship Diagram',
          'Element Record Database',
          'Existing Relational Design'
        ],
        answer: 1,
        explain: 'ERD = Entity Relationship Diagram ใช้แสดงความสัมพันธ์ระหว่าง Entity ในการออกแบบฐานข้อมูล'
      },
      {
        q: 'Entity ในการออกแบบฐานข้อมูลคืออะไร?',
        choices: [
          'คอลัมน์ในตาราง',
          'สิ่งที่เราต้องการจัดเก็บข้อมูล เช่น นักเรียน, สินค้า, คำสั่งซื้อ',
          'ความสัมพันธ์ระหว่างตาราง',
          'ชนิดข้อมูลใน Field'
        ],
        answer: 1,
        explain: 'Entity คือ "วัตถุ" หรือ "สิ่งของ" ที่เราสนใจจัดเก็บข้อมูล แต่ละ Entity จะกลายเป็นตารางในฐานข้อมูล'
      },
      {
        q: 'Attribute ในแง่ ERD คืออะไร?',
        choices: [
          'ชื่อของตาราง',
          'คุณสมบัติหรือรายละเอียดของ Entity',
          'ความสัมพันธ์ระหว่าง Entity',
          'Primary Key ของตาราง'
        ],
        answer: 1,
        explain: 'Attribute คือคุณสมบัติของ Entity เช่น Entity "นักเรียน" มี Attribute: รหัสนักเรียน, ชื่อ, นามสกุล'
      },
      {
        q: 'ความสัมพันธ์แบบ One-to-Many หมายความว่าอย่างไร?',
        choices: [
          'รายการหนึ่งในตาราง A สัมพันธ์กับรายการหนึ่งในตาราง B เท่านั้น',
          'รายการหนึ่งในตาราง A สัมพันธ์ได้กับหลายรายการในตาราง B',
          'หลายรายการในตาราง A สัมพันธ์กับหลายรายการในตาราง B',
          'ไม่มีความสัมพันธ์ระหว่างตาราง'
        ],
        answer: 1,
        explain: 'One-to-Many: ครู 1 คนสอนได้หลายห้อง แต่แต่ละห้องมีครูประจำ 1 คน'
      },
      {
        q: 'Foreign Key คืออะไร?',
        choices: [
          'Key ที่ใช้ล็อกฐานข้อมูล',
          'Key จากต่างประเทศ',
          'Field ในตารางหนึ่งที่อ้างอิงไปยัง Primary Key ของอีกตาราง',
          'Primary Key สำรอง'
        ],
        answer: 2,
        explain: 'Foreign Key คือ Field ที่เชื่อมตารางสองตารางเข้าด้วยกัน โดยอ้างอิง Primary Key ของตารางอื่น'
      },
      {
        q: 'Normalization (การ Normalize) มีวัตถุประสงค์หลักเพื่ออะไร?',
        choices: [
          'ทำให้ฐานข้อมูลทำงานเร็วขึ้น',
          'ลดความซ้ำซ้อนของข้อมูลและป้องกัน Anomaly',
          'เพิ่มขนาดของฐานข้อมูล',
          'ทำให้ตาราง Join กันยากขึ้น'
        ],
        answer: 1,
        explain: 'Normalization ช่วยลด Data Redundancy และป้องกัน Insert/Update/Delete Anomaly'
      },
      {
        q: '1NF (First Normal Form) กำหนดว่าอะไร?',
        choices: [
          'ต้องมี Primary Key',
          'แต่ละ Field ต้องเก็บค่าเดียว (Atomic) ไม่ซ้ำกัน',
          'ต้องไม่มี NULL',
          'ต้องมีอย่างน้อย 2 ตาราง'
        ],
        answer: 1,
        explain: '1NF: ทุก Field ต้องเก็บค่าเดียว (Atomic Value) ไม่มี Repeating Group'
      },
      {
        q: 'ในการออกแบบ ERD รูปสี่เหลี่ยมผืนผ้าแทนอะไร?',
        choices: [
          'Attribute',
          'Relationship',
          'Entity',
          'Primary Key'
        ],
        answer: 2,
        explain: 'ใน ERD: สี่เหลี่ยม = Entity, วงรี = Attribute, เพชร = Relationship, เส้น = การเชื่อม'
      },
      {
        q: 'Data Dictionary คืออะไร?',
        choices: [
          'พจนานุกรมภาษาข้อมูล',
          'เอกสารที่อธิบาย Field แต่ละ Field ในฐานข้อมูล ชนิดข้อมูล ความหมาย',
          'รายชื่อ User ทั้งหมด',
          'คำสั่ง SQL ทั้งหมด'
        ],
        answer: 1,
        explain: 'Data Dictionary เป็นเอกสารอ้างอิงที่อธิบายโครงสร้างฐานข้อมูล รวมถึงชื่อ Field, ชนิดข้อมูล, ความหมาย'
      },
      {
        q: 'ความสัมพันธ์แบบ Many-to-Many มักจัดการอย่างไรในฐานข้อมูลจริง?',
        choices: [
          'ไม่สามารถทำได้',
          'สร้างตารางกลาง (Junction Table) เพื่อแยกเป็น One-to-Many สองความสัมพันธ์',
          'ใส่ค่าซ้ำในตารางเดียว',
          'ใช้ Primary Key สองตัว'
        ],
        answer: 1,
        explain: 'M:N แก้โดยสร้าง Junction Table เช่น นักเรียน-วิชา → ตาราง "ลงทะเบียน" กลาง'
      }
    ]
  },
  3: {
    title: 'หน่วยที่ 3: การสร้างฐานข้อมูลด้วย MS Access',
    questions: [
      {
        q: 'Microsoft Access เป็นซอฟต์แวร์ประเภทใด?',
        choices: [
          'ระบบปฏิบัติการ',
          'DBMS (Database Management System)',
          'โปรแกรมตกแต่งรูปภาพ',
          'โปรแกรม Spreadsheet'
        ],
        answer: 1,
        explain: 'MS Access เป็น DBMS แบบ Desktop ที่มาพร้อม Microsoft Office ใช้สร้างและจัดการฐานข้อมูลขนาดเล็กถึงกลาง'
      },
      {
        q: 'นามสกุลไฟล์ของ Microsoft Access คืออะไร?',
        choices: [
          '.xls',
          '.doc',
          '.accdb',
          '.sql'
        ],
        answer: 2,
        explain: '.accdb คือนามสกุลไฟล์ฐานข้อมูล Access (Access 2007 ขึ้นไป) ส่วนรุ่นเก่าใช้ .mdb'
      },
      {
        q: 'ชนิดข้อมูล Text/Short Text ใน Access ใช้เก็บอะไร?',
        choices: [
          'ตัวเลขทศนิยม',
          'ข้อความสั้น ไม่เกิน 255 ตัวอักษร',
          'ข้อความยาวไม่จำกัด',
          'วันที่และเวลา'
        ],
        answer: 1,
        explain: 'Short Text เก็บข้อความสั้นไม่เกิน 255 ตัวอักษร เหมาะกับชื่อ ที่อยู่ รหัส'
      },
      {
        q: 'ชนิดข้อมูล AutoNumber ใน Access ทำงานอย่างไร?',
        choices: [
          'ผู้ใช้ต้องกรอกเลขเอง',
          'Access สร้างเลขลำดับให้อัตโนมัติ ไม่ซ้ำกัน เหมาะสำหรับ Primary Key',
          'คำนวณจากสูตร',
          'สุ่มตัวเลข'
        ],
        answer: 1,
        explain: 'AutoNumber สร้างเลข ID อัตโนมัติแบบเพิ่มทีละ 1 ไม่ซ้ำกัน เหมาะกับ Primary Key มาก'
      },
      {
        q: 'Input Mask ใน Access คืออะไร?',
        choices: [
          'รูปแบบการแสดงผลข้อมูล',
          'กำหนดรูปแบบการป้อนข้อมูล เช่น เบอร์โทร วันที่',
          'ซ่อน Field บางส่วน',
          'ตัวกรองข้อมูล'
        ],
        answer: 1,
        explain: 'Input Mask ควบคุมรูปแบบการกรอกข้อมูล เช่น ###-###-#### สำหรับเบอร์โทรศัพท์'
      },
      {
        q: 'Validation Rule ใน Access ใช้ทำอะไร?',
        choices: [
          'ตรวจสอบรหัสผ่าน',
          'กำหนดเงื่อนไขที่ข้อมูลต้องตรงตาม ก่อนบันทึก',
          'ล็อกตาราง',
          'สำรองข้อมูล'
        ],
        answer: 1,
        explain: 'Validation Rule เป็นเงื่อนไขตรวจสอบ เช่น ">0" หมายถึงต้องกรอกตัวเลขมากกว่า 0'
      },
      {
        q: 'Lookup Wizard ใน Access ช่วยอะไร?',
        choices: [
          'ค้นหาไฟล์ในคอมพิวเตอร์',
          'สร้าง Field ที่ดึงข้อมูลจากตารางอื่น หรือกำหนดรายการให้เลือก',
          'สร้าง Query อัตโนมัติ',
          'เชื่อมอินเตอร์เน็ต'
        ],
        answer: 1,
        explain: 'Lookup Wizard สร้าง Combo Box/List Box ที่แสดงรายการให้เลือก โดยดึงจาก Table อื่นหรือกำหนดเอง'
      },
      {
        q: 'Datasheet View ใน Access คืออะไร?',
        choices: [
          'มุมมองการออกแบบตาราง',
          'มุมมองที่แสดงข้อมูลในรูปตาราง แถว/คอลัมน์ คล้าย Excel',
          'มุมมอง Report',
          'มุมมอง Query'
        ],
        answer: 1,
        explain: 'Datasheet View แสดงข้อมูลในตารางในรูปแบบกริด ใช้สำหรับดูและแก้ไขข้อมูล'
      },
      {
        q: 'Design View ใน Table ของ Access ใช้ทำอะไร?',
        choices: [
          'กรอกข้อมูล',
          'ออกแบบโครงสร้างตาราง กำหนด Field ชนิดข้อมูล คุณสมบัติ',
          'พิมพ์รายงาน',
          'สร้าง Query'
        ],
        answer: 1,
        explain: 'Design View ใช้กำหนดโครงสร้างตาราง เช่น ชื่อ Field, Data Type, Field Properties'
      },
      {
        q: 'ข้อใดคือ Object หลักใน MS Access?',
        choices: [
          'Table, Query, Form, Report',
          'Sheet, Cell, Chart, Macro',
          'Slide, Animation, Transition, Layout',
          'Document, Paragraph, Header, Footer'
        ],
        answer: 0,
        explain: 'Access มี 4 Object หลัก: Table (เก็บข้อมูล), Query (สืบค้น), Form (กรอกข้อมูล), Report (รายงาน)'
      }
    ]
  },
  4: {
    title: 'หน่วยที่ 4: ความสัมพันธ์ระหว่างตาราง',
    questions: [
      {
        q: 'Relationship ระหว่างตารางใน Access สร้างได้จากที่ไหน?',
        choices: [
          'เมนู Home > Relationship',
          'เมนู Database Tools > Relationships',
          'คลิกขวาที่ตาราง',
          'เมนู View > Relationship'
        ],
        answer: 1,
        explain: 'สร้าง Relationship ได้จาก Database Tools แถบเมนูบน แล้วคลิก Relationships'
      },
      {
        q: 'Referential Integrity ในความสัมพันธ์ตารางหมายความว่าอย่างไร?',
        choices: [
          'ตารางต้องมีชื่อเหมือนกัน',
          'ป้องกันการเพิ่ม/ลบ/แก้ไขข้อมูลที่จะทำให้ความสัมพันธ์ขาดความถูกต้อง',
          'ต้องมี Primary Key ทุกตาราง',
          'ต้องใช้ชนิดข้อมูลเดียวกัน'
        ],
        answer: 1,
        explain: 'Referential Integrity คือการรักษาความสมบูรณ์ของความสัมพันธ์ เช่น ห้ามลบข้อมูลพ่อแม่ถ้ายังมีลูก'
      },
      {
        q: 'Cascade Update Related Fields หมายความว่าอะไร?',
        choices: [
          'ลบข้อมูลอัตโนมัติ',
          'เมื่อแก้ไข Primary Key จะอัปเดต Foreign Key ที่เชื่อมอยู่ทุก Record อัตโนมัติ',
          'สำรองข้อมูลอัตโนมัติ',
          'เรียงลำดับข้อมูล'
        ],
        answer: 1,
        explain: 'Cascade Update: เมื่อเปลี่ยน PK ในตารางหลัก FK ที่อ้างอิงในตารางย่อยจะเปลี่ยนตามอัตโนมัติ'
      },
      {
        q: 'Inner Join คืออะไร?',
        choices: [
          'แสดงทุก Record จากทั้งสองตาราง',
          'แสดงเฉพาะ Record ที่มีข้อมูลตรงกันในทั้งสองตาราง',
          'แสดง Record จากตารางซ้ายทั้งหมด',
          'แสดง Record จากตารางขวาทั้งหมด'
        ],
        answer: 1,
        explain: 'Inner Join คืนผลเฉพาะ Record ที่มีค่า Key ตรงกันในทั้งสองตาราง'
      },
      {
        q: 'ถ้าต้องการลิงก์ตาราง "สินค้า" และ "หมวดหมู่" โดยสินค้าหนึ่งอยู่ได้หนึ่งหมวด แต่หมวดหนึ่งมีหลายสินค้า นี่คือความสัมพันธ์แบบใด?',
        choices: [
          'One-to-One',
          'Many-to-Many',
          'One-to-Many (หมวด → สินค้า)',
          'Many-to-One (สินค้า → หมวด)'
        ],
        answer: 2,
        explain: 'หมวดหนึ่ง (1) → สินค้าหลายตัว (Many) = One-to-Many จาก "หมวดหมู่" ไปยัง "สินค้า"'
      },
      {
        q: 'Subdatasheet ใน Access คืออะไร?',
        choices: [
          'ตารางย่อยที่แสดงข้อมูลที่สัมพันธ์กันใน Row ของตารางหลัก',
          'ชีตที่สอง',
          'มุมมอง Report',
          'Form ย่อย'
        ],
        answer: 0,
        explain: 'Subdatasheet คือการแสดง Record ที่เชื่อมกันจากตารางอื่นแบบ Nested ในแต่ละแถวของตารางหลัก'
      },
      {
        q: 'ใน Relationship Window เส้นที่เชื่อมระหว่างตาราง แสดงอะไร?',
        choices: [
          'ลำดับการสร้างตาราง',
          'ความสัมพันธ์ระหว่าง Primary Key และ Foreign Key',
          'การเรียงลำดับข้อมูล',
          'สิทธิ์การเข้าถึง'
        ],
        answer: 1,
        explain: 'เส้นใน Relationship Window แสดงการเชื่อม PK ของตารางหนึ่งกับ FK ของอีกตาราง'
      },
      {
        q: 'เครื่องหมาย "1" และ "∞" ใน Relationship หมายถึงอะไร?',
        choices: [
          '1 = ตารางแรก, ∞ = ตารางที่สอง',
          '1 = ด้าน Primary Key (หนึ่ง), ∞ = ด้าน Foreign Key (มาก)',
          '1 = เร็ว, ∞ = ช้า',
          'ไม่มีความหมายพิเศษ'
        ],
        answer: 1,
        explain: '"1" อยู่ฝั่ง Primary Key (One side) และ "∞" อยู่ฝั่ง Foreign Key (Many side)'
      },
      {
        q: 'Cascade Delete Related Records คืออะไร?',
        choices: [
          'ลบฐานข้อมูลทั้งหมด',
          'เมื่อลบ Record ในตารางหลัก จะลบ Record ที่เชื่อมกันในตารางย่อยอัตโนมัติ',
          'สำรองข้อมูลก่อนลบ',
          'ลบ Field'
        ],
        answer: 1,
        explain: 'Cascade Delete: ลบ Order → ลบ OrderDetail ที่เชื่อมกันทั้งหมดอัตโนมัติ'
      },
      {
        q: 'ก่อนสร้าง Relationship ระหว่างสองตาราง Field ที่ใช้เชื่อมต้องมีคุณสมบัติอะไร?',
        choices: [
          'ชนิดข้อมูลต้องเหมือนกัน',
          'ต้องมีชื่อเหมือนกัน',
          'ต้องเป็น AutoNumber เท่านั้น',
          'ต้องเป็น Text เท่านั้น'
        ],
        answer: 0,
        explain: 'Field ที่ใช้เชื่อมต้องมี Data Type เหมือนกัน เช่น Number ↔ Number, Text ↔ Text'
      }
    ]
  },
  5: {
    title: 'หน่วยที่ 5: การจัดการข้อมูล (Query & CRUD)',
    questions: [
      {
        q: 'Query ใน Access คืออะไร?',
        choices: [
          'ตารางใหม่',
          'คำสั่งสืบค้นข้อมูลจากตาราง สามารถกรอง จัดเรียง คำนวณได้',
          'ฟอร์มกรอกข้อมูล',
          'รายงาน'
        ],
        answer: 1,
        explain: 'Query คือคำถามที่เราถามฐานข้อมูล เช่น "แสดงสินค้าทั้งหมดที่ราคาเกิน 100 บาท"'
      },
      {
        q: 'Select Query ทำงานอย่างไร?',
        choices: [
          'ลบข้อมูล',
          'เพิ่มข้อมูล',
          'ดึงข้อมูลจากตารางตามเงื่อนไขที่กำหนด',
          'อัปเดตข้อมูล'
        ],
        answer: 2,
        explain: 'Select Query เป็น Query พื้นฐาน ใช้ดึง (Select) ข้อมูลจากตารางตาม Criteria ที่กำหนด'
      },
      {
        q: 'Criteria ใน Query Design Grid คืออะไร?',
        choices: [
          'ชื่อของ Query',
          'เงื่อนไขที่ใช้กรองข้อมูล เช่น "กรุงเทพ" หรือ ">1000"',
          'การเรียงลำดับ',
          'ชื่อ Field'
        ],
        answer: 1,
        explain: 'Criteria คือเงื่อนไขกรอง เช่น [ราคา] > 500 หมายถึงแสดงเฉพาะสินค้าที่ราคาเกิน 500'
      },
      {
        q: 'CRUD ย่อมาจากอะไร?',
        choices: [
          'Create, Read, Update, Delete',
          'Connect, Run, Upload, Download',
          'Copy, Restore, Undo, Delete',
          'Create, Retrieve, Upload, Drop'
        ],
        answer: 0,
        explain: 'CRUD = Create (เพิ่ม), Read (อ่าน), Update (แก้ไข), Delete (ลบ) คือ 4 การดำเนินการพื้นฐาน'
      },
      {
        q: 'Update Query ใน Access ใช้ทำอะไร?',
        choices: [
          'เพิ่ม Record ใหม่',
          'แก้ไขข้อมูลใน Record ที่มีอยู่แล้วตามเงื่อนไข',
          'ลบ Record',
          'สร้างตารางใหม่'
        ],
        answer: 1,
        explain: 'Update Query ใช้อัปเดตค่าใน Field ของ Record ที่ตรงตาม Criteria'
      },
      {
        q: 'Delete Query ใน Access ใช้ทำอะไร?',
        choices: [
          'ลบทั้ง Table',
          'ลบ Field',
          'ลบ Record ที่ตรงตามเงื่อนไขที่กำหนด',
          'ลบ Query'
        ],
        answer: 2,
        explain: 'Delete Query ลบ Record ที่ตรง Criteria ควรระวังเพราะลบแล้วกู้คืนไม่ได้'
      },
      {
        q: 'Append Query ใน Access ใช้ทำอะไร?',
        choices: [
          'คัดลอกโครงสร้างตาราง',
          'นำข้อมูลจาก Query ผนวกเพิ่มเข้าไปในตารางปลายทาง',
          'สร้างรายงาน',
          'ส่งออกข้อมูล'
        ],
        answer: 1,
        explain: 'Append Query เพิ่ม Record ลงในตารางที่มีอยู่แล้ว มักใช้รวมข้อมูลจากหลายแหล่ง'
      },
      {
        q: 'Parameter Query คืออะไร?',
        choices: [
          'Query ที่ทำงานอัตโนมัติ',
          'Query ที่ถามผู้ใช้ป้อนค่าเงื่อนไขทุกครั้งที่รัน',
          'Query ที่ใช้สูตรคณิตศาสตร์',
          'Query ที่เชื่อมหลายตาราง'
        ],
        answer: 1,
        explain: 'Parameter Query แสดง Dialog Box ถามค่า ทำให้ Query ยืดหยุ่น เช่น "ป้อนเดือนที่ต้องการ:"'
      },
      {
        q: 'Aggregate Function ใน Query เช่น SUM, COUNT, AVG ใช้ในแถวใดของ Query Design?',
        choices: [
          'Criteria',
          'Field',
          'Total',
          'Sort'
        ],
        answer: 2,
        explain: 'เปิดใช้ Aggregate ได้จากแถว "Total" ใน Query Design Grid (View > Totals)'
      },
      {
        q: 'ถ้าต้องการนับจำนวนสินค้าในแต่ละหมวดหมู่ ควรใช้อะไร?',
        choices: [
          'Select Query ธรรมดา',
          'Totals Query ด้วย GROUP BY หมวดหมู่ และ COUNT(รหัสสินค้า)',
          'Delete Query',
          'Append Query'
        ],
        answer: 1,
        explain: 'ใช้ Totals Query > GROUP BY หมวดหมู่ + COUNT เพื่อนับจำนวนสินค้าในแต่ละหมวด'
      }
    ]
  },
  6: {
    title: 'หน่วยที่ 6: Form, Report และ Macro',
    questions: [
      {
        q: 'Form ใน Access ใช้ทำอะไร?',
        choices: [
          'สืบค้นข้อมูล',
          'หน้าจอสำหรับกรอก ดู และแก้ไขข้อมูลอย่างสะดวก',
          'สร้างรายงานการพิมพ์',
          'กำหนดความสัมพันธ์ตาราง'
        ],
        answer: 1,
        explain: 'Form คือหน้าจอ User Interface สำหรับให้ผู้ใช้กรอก/แก้ไขข้อมูลโดยไม่ต้องเปิด Datasheet View'
      },
      {
        q: 'Report ใน Access ใช้ทำอะไร?',
        choices: [
          'กรอกข้อมูล',
          'สร้างเอกสารสรุปข้อมูลเพื่อนำเสนอหรือพิมพ์',
          'สร้างตารางใหม่',
          'เชื่อมต่ออินเตอร์เน็ต'
        ],
        answer: 1,
        explain: 'Report ใช้จัดรูปแบบและนำเสนอข้อมูลในรูปแบบที่เหมาะกับการพิมพ์หรือแสดงผล'
      },
      {
        q: 'Macro ใน Access คืออะไร?',
        choices: [
          'ไวรัสคอมพิวเตอร์',
          'ชุดคำสั่งที่บันทึกไว้สำหรับทำงานอัตโนมัติโดยไม่ต้องเขียน Code',
          'ฟอนต์ขนาดใหญ่',
          'รายงานสรุป'
        ],
        answer: 1,
        explain: 'Macro คือชุด Action ที่ทำงานอัตโนมัติ เช่น เปิด Form, รัน Query, แสดง Message โดยไม่ต้องเขียน VBA'
      },
      {
        q: 'AutoForm ใน Access ช่วยอะไร?',
        choices: [
          'กรอกข้อมูลอัตโนมัติ',
          'สร้าง Form โดยอัตโนมัติจาก Table หรือ Query ที่เลือก',
          'ส่งออก Form เป็น PDF',
          'พิมพ์ Form'
        ],
        answer: 1,
        explain: 'AutoForm สร้าง Form อย่างรวดเร็วโดย Access จัดวาง Control ให้อัตโนมัติ'
      },
      {
        q: 'Control ใน Form Design คืออะไร?',
        choices: [
          'ปุ่มควบคุมโปรแกรม',
          'องค์ประกอบในฟอร์ม เช่น Text Box, Label, Button, Combo Box',
          'รหัสผ่านฟอร์ม',
          'ชื่อของฟอร์ม'
        ],
        answer: 1,
        explain: 'Control คือส่วนประกอบใน Form เช่น TextBox (กรอกข้อมูล), Label (ป้ายกำกับ), CommandButton (ปุ่ม)'
      },
      {
        q: 'Bound Control คืออะไร?',
        choices: [
          'Control ที่ไม่เชื่อมกับ Field',
          'Control ที่เชื่อมกับ Field ในตาราง แสดง/แก้ไขข้อมูลจริง',
          'Control ที่ใช้ตกแต่ง',
          'Control ที่ใช้คำนวณ'
        ],
        answer: 1,
        explain: 'Bound Control เชื่อมกับ Field จริง เช่น TextBox ที่แสดงชื่อนักเรียน'
      },
      {
        q: 'Report ส่วน Header/Footer ใช้ทำอะไร?',
        choices: [
          'กำหนดสีพื้นหลัง',
          'Header = แสดงที่ส่วนบน (หัวกระดาษ/หัวกลุ่ม), Footer = ส่วนล่าง (ผลรวม/หน้า)',
          'ซ่อนข้อมูล',
          'ล็อก Report'
        ],
        answer: 1,
        explain: 'Header ใช้แสดงชื่อรายงาน หัวตาราง ส่วน Footer ใช้แสดงผลรวม เลขหน้า วันที่พิมพ์'
      },
      {
        q: 'Grouping & Sorting ใน Report ใช้ทำอะไร?',
        choices: [
          'จัดกลุ่มข้อมูลและเรียงลำดับเพื่อให้รายงานอ่านง่ายขึ้น',
          'เปลี่ยนสีข้อมูล',
          'ลบข้อมูลที่ซ้ำ',
          'ส่งออกข้อมูล'
        ],
        answer: 0,
        explain: 'Grouping จัดกลุ่มข้อมูล เช่น จัดกลุ่มสินค้าตามหมวดหมู่ Sorting เรียงภายในกลุ่ม'
      },
      {
        q: 'Event Procedure ใน Form/Report คืออะไร?',
        choices: [
          'กิจกรรมนอกสถานที่',
          'VBA Code ที่ทำงานเมื่อเกิด Event เช่น คลิกปุ่ม, เปิดฟอร์ม',
          'แม่แบบฟอร์ม',
          'การพิมพ์'
        ],
        answer: 1,
        explain: 'Event Procedure คือ VBA ที่รันเมื่อ Event เกิดขึ้น เช่น On Click → บันทึกข้อมูล'
      },
      {
        q: 'Navigation Form ใน Access คืออะไร?',
        choices: [
          'Form ที่แสดงแผนที่',
          'Form หลักที่รวม Form และ Report อื่นๆ ทำหน้าที่เป็นเมนูหลักของระบบ',
          'Form ค้นหาข้อมูล',
          'Form สำหรับ Import ข้อมูล'
        ],
        answer: 1,
        explain: 'Navigation Form ทำหน้าที่เป็น Main Menu ของระบบ มี Tab/Button เชื่อมไปยัง Form และ Report ต่างๆ'
      }
    ]
  }
};

// ============================================================
// QUIZ ENGINE — ควบคุมการทำแบบทดสอบ
// ============================================================
const QuizEngine = (() => {
  let currentUnit = null;
  let currentQuestions = [];
  let currentIndex = 0;
  let userAnswers = [];
  let startTime = null;

  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function start(unitNum) {
    if (!Auth.isUnlocked(unitNum)) {
      QuizUI.showLockedMessage(unitNum);
      return;
    }
    currentUnit = unitNum;
    const bank = QUIZ_BANK[unitNum];
    currentQuestions = shuffle(bank.questions); // สุ่มลำดับข้อ
    currentIndex = 0;
    userAnswers = new Array(currentQuestions.length).fill(null);
    startTime = Date.now();
    QuizUI.renderQuiz(unitNum, currentQuestions);
  }

  function selectAnswer(choiceIdx) {
    userAnswers[currentIndex] = choiceIdx;
    QuizUI.highlightAnswer(currentIndex, choiceIdx);
  }

  function next() {
    if (userAnswers[currentIndex] === null) {
      QuizUI.showWarning('กรุณาเลือกคำตอบก่อน');
      return;
    }
    if (currentIndex < currentQuestions.length - 1) {
      currentIndex++;
      QuizUI.renderQuestion(currentIndex);
    } else {
      submit();
    }
  }

  function prev() {
    if (currentIndex > 0) {
      currentIndex--;
      QuizUI.renderQuestion(currentIndex);
    }
  }

  function submit() {
    const score = userAnswers.reduce((acc, ans, i) => {
      return acc + (ans === currentQuestions[i].answer ? 1 : 0);
    }, 0);

    const duration = Math.round((Date.now() - startTime) / 1000);
    const attempt = Auth.saveScore(currentUnit, score, currentQuestions.length, userAnswers);

    // ส่งข้อมูลไป n8n
    sendToN8N(currentUnit, score, currentQuestions.length, userAnswers, duration);

    QuizUI.showResult(currentUnit, score, currentQuestions.length, userAnswers, currentQuestions, attempt);
  }

  function getCurrentIndex() { return currentIndex; }
  function getCurrentQuestions() { return currentQuestions; }
  function getUserAnswers() { return userAnswers; }

  return { start, selectAnswer, next, prev, submit, getCurrentIndex, getCurrentQuestions, getUserAnswers };
})();

// ============================================================
// SEND TO N8N — ส่งผลสอบไปให้ AI วิเคราะห์
// ============================================================
async function sendToN8N(unitNum, score, total, answers, duration) {
  const user = Auth.getCurrentUser();
  if (!user) return;

  const questions = QuizEngine.getCurrentQuestions();
  const payload = {
    student: {
      username: user.username,
      displayName: user.displayName,
    },
    quiz: {
      unit: unitNum,
      unitTitle: QUIZ_BANK[unitNum].title,
      score,
      total,
      percent: Math.round((score / total) * 100),
      passed: Math.round((score / total) * 100) >= PASS_PERCENT,
      durationSeconds: duration,
      timestamp: new Date().toISOString(),
    },
    answers: answers.map((ans, i) => ({
      questionNum: i + 1,
      question: questions[i].q,
      selectedChoice: questions[i].choices[ans] ?? 'ไม่ได้ตอบ',
      correctChoice: questions[i].choices[questions[i].answer],
      isCorrect: ans === questions[i].answer,
      explanation: questions[i].explain,
    })),
    allScores: user.scores,
  };

  try {
    await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'no-cors', // ถ้า n8n ไม่ได้ตั้ง CORS
    });
    console.log('✅ ส่งข้อมูลไป n8n สำเร็จ');
  } catch (err) {
    console.warn('⚠️ ไม่สามารถส่งข้อมูลไป n8n:', err);
  }
}
