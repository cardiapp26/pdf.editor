# PDF Annotator – Akıllı Tahta

Tarayıcıda çalışan, tek dosyadan oluşan gelişmiş PDF düzenleme ve notlandırma aracı.
Sunucu gerektirmez — `index.html` dosyasını doğrudan açabilir veya herhangi bir statik web sunucusuyla servis edebilirsiniz.

---

## Özellikler

### ✏️ Çizim Araçları
| Araç | Kısayol | Açıklama |
|------|---------|----------|
| Seç | `V` | Nesneleri seç, taşı, boyutlandır |
| Kalem | `P` | Serbest el çizimi |
| Vurgulayıcı | `H` | Yarı saydam renkli vurgulama |
| Silgi | `E` | Çizim veya şekil sil |
| Çizgi | `L` | Düz çizgi |
| Ok | `A` | Yönlü ok |
| Dikdörtgen | `R` | Dikdörtgen / kare |
| Daire | `C` | Elips / daire |
| Metin | `T` | Yazı kutusu (font, boyut, B/I/U, renk) |
| İmza | `S` | Kayıtlı imzayı sayfaya ekle |

### 📄 Sayfa Organizasyonu
- **Sürükle-bırak** ile sayfaları yeniden sırala
- Sayfaları **sil**
- Başka bir PDF'den sayfa **ekle**
- **Resim** (JPG, PNG) dosyasını sayfa olarak ekle
- **Word (.docx)** belgesini sayfaya dönüştürüp ekle

### 🌐 Çeviri
- `Q` ile çeviri modunu aç
- PDF metnini seçince otomatik çeviri (TR ↔ EN)
- Dil otomatik algılanır; algılanamadığında manuel seçim

### 🖊️ İmza
- PNG / JPG imza dosyası yükle
- İmzalar **tarayıcı yerel deposunda** (localStorage) saklanır (max 12)
- İmzayı seç → sayfaya ekle → taşı / boyutlandır

### 🔍 Diğer
- Alan kopyalama — `X` ile bölge seç → panoya PNG kopyala
- Geri Al / İleri Al — `Ctrl+Z` / `Ctrl+Y`
- Tam ekran — `F`
- PDF'yi kaydet — `Ctrl+S`
- Kaydırarak sayfa geçişi (scroll ile alt/üst kenara gelince otomatik)
- Fit-width: PDF açılınca ekran genişliğine otomatik sığdırma

---

## Kullanım

```bash
# Herhangi bir statik sunucu
python3 -m http.server 8080
# → http://localhost:8080
```

veya `index.html` dosyasını doğrudan tarayıcıda açın.

---

## Kullanılan Kütüphaneler

| Kütüphane | Sürüm | Kullanım |
|-----------|-------|----------|
| [PDF.js](https://mozilla.github.io/pdf.js/) | 3.11.174 | PDF render + metin katmanı |
| [Fabric.js](http://fabricjs.com/) | 5.3.1 | Canvas çizim motoru |
| [jsPDF](https://github.com/parallax/jsPDF) | 2.5.1 | PDF dışa aktarma |
| [Mammoth.js](https://github.com/mwilliamson/mammoth.js) | 1.6.0 | DOCX → HTML dönüştürme |
| [html2canvas](https://html2canvas.hertzen.com/) | 1.4.1 | HTML → canvas render |

Tüm kütüphaneler CDN üzerinden yüklenir; internet bağlantısı gerektirir.

---

## Mimari

Proje tek bir HTML dosyasından (`index.html`) oluşur:
- CSS — satır içi `<style>` bloğu
- HTML — tüm UI bileşenleri
- JavaScript — tüm uygulama mantığı

---

## Lisans

MIT
