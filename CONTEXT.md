# Cahaya Mustika Internesia — Marketing Site

The public marketing site for Cahaya Mustika Internesia (CMI), an Indonesian
systems integrator. `rev2/` is the current design revision and the only one
under active development.

## Language

### Site structure

**Solusi**:
A named offering CMI sells, addressed to a buyer's problem rather than to a
product SKU. Every Solusi has its own page under `rev2/`.
_Avoid_: Service, product, package

**Vertical Solution**:
A Solusi scoped to one kind of institution — Smart Campus, Smart School,
Smart Hospital. Lives in `rev2/solutions/<slug>/`, all sharing `solution.css`.
_Avoid_: Industry page, segment page

**Facility Solution**:
A Solusi scoped to one physical space or hardware system — Auditorium,
Commercial Display, Security System, Furniture. Lives in `rev2/facility/<slug>/`.
_Avoid_: Product page, hardware page

**Digital Solution**:
A Solusi that is software rather than a room or a device — LMS, Building
Management, Cyber Security. Lives in `rev2/digital/<slug>/`. Collectively
presented as **Solusi Integrasi Digital**.
_Avoid_: App, platform, IT solution

**Induk**:
The hub page that indexes a family of Solusi. `rev2/digital/integrasi-digital/`
is the induk for the Digital Solutions; `rev2/solutions/index.html` is the
induk for everything.
_Avoid_: Parent page, landing page, category page

**Spine**:
The fixed ordered list of sections every page in a family uses. Digital
Solutions have two: the **product spine** and the **service spine**.
_Avoid_: Template, layout, skeleton

### Design system

**Token**:
A CSS custom property in `rev2/styles.css` `:root`. The only sanctioned source
of colour, font, radius, shadow, spacing and easing values sitewide.
_Avoid_: Variable, constant, theme value

**Primitive**:
A shared utility class in `rev2/styles.css` — `.u-section-title`,
`.u-eyebrow-bar`, `.u-cta`, `.u-card`, `.u-card--sharp`, `.u-kicker`. New
markup applies primitives; it never re-declares their rules.
_Avoid_: Component, helper, mixin

**Mock UI**:
A product screen drawn in HTML + CSS + inline SVG from tokens only, standing in
for a screenshot. Used where no photography exists.
_Avoid_: Mockup image, placeholder, screenshot

### Partner

**Zerra**:
Third-party software platform (myzerra.id) whose products sit underneath some
CMI Digital Solutions. Surfaced only as an `Integrated by` badge, and only on
pages a Zerra product actually powers.
_Avoid_: Vendor, supplier, white-label

### Education domain

These three Digital Solutions all descend from Zerra's ZerraEdu and are bounded
strictly so they do not overlap.

**LMS & E-Learning Platform**:
Teaching and learning. Materi, tugas, ujian online/CBT, penilaian, learning
analytics. Actors: guru, siswa.
_Avoid_: E-learning, academic system, school software

**Sistem Administrasi Sekolah**:
The school's system of record. PPDB, data induk siswa, jadwal & kelas, absensi
harian, raport, kepegawaian, portal orang tua. Actors: tata usaha, kepala sekolah.
_Avoid_: SIAKAD, school management, academic system

**Software Keuangan Sekolah**:
Money only. SPP & tagihan, payment gateway/VA, tunggakan, RKAS/anggaran,
laporan keuangan. Actor: bendahara.
_Avoid_: Billing system, finance module, pembayaran

**Nilai**:
A mark produced by assessment inside the LMS.
_Avoid_: Grade, score

**Raport**:
The official periodic report published by Sistem Administrasi Sekolah. Consumes
Nilai from the LMS; the LMS never publishes a Raport.
_Avoid_: Report card, transcript

**Absensi Harian**:
Daily institutional attendance, owned by Sistem Administrasi Sekolah. Distinct
from per-session presence inside a course, which the LMS owns.
_Avoid_: Attendance, kehadiran
