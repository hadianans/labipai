# Baitulhikmah API - Postman Collection

## Cara Import

### Import Collection
1. Buka Postman
2. Click **Import** (atau Ctrl+O)
3. Pilih file `Baitulhikmah_API.postman_collection.json`
4. Collection akan muncul di sidebar

### Import Environment
1. Click **Environments** di sidebar kiri
2. Click **Import**
3. Pilih salah satu environment:
   - `Baitulhikmah_Local.postman_environment.json` - untuk development lokal
   - `Baitulhikmah_Production.postman_environment.json` - untuk production
4. Pilih environment yang sesuai di dropdown kanan atas

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `base_url` | Base URL API server | `http://localhost:8000` |
| `token` | User auth token | (dari response login) |
| `admin_token` | Admin auth token | (dari response login admin) |

---

## Cara Menggunakan

### 1. Setup Token Setelah Login

Setelah menjalankan request **Login** atau **Register**, copy nilai `token` dari response:

```json
{
  "data": {
    "token": "1|abc123..."  // copy value ini
  }
}
```

Lalu set di environment:
1. Click **Environments** > pilih environment aktif
2. Paste token di field `token` (untuk user biasa) atau `admin_token` (untuk admin)
3. Click **Save**

### 2. Request Flow yang Disarankan

**Untuk testing user biasa:**
1. `Auth/Register` atau `Auth/Login`
2. Copy token ke environment variable `token`
3. Test endpoint lainnya

**Untuk testing admin:**
1. Login dengan akun admin
2. Copy token ke environment variable `admin_token`
3. Test endpoint admin (Create, Update, Delete)

---

## Request Categories

| Folder | Description | Auth Required |
|--------|-------------|---------------|
| **Auth** | Register, Login, Logout, Profile | Partial |
| **Books** | Buku CRUD, Peminjaman, Review | Partial |
| **Genres** | Genre buku CRUD | Admin only for CUD |
| **Courses** | Kursus CRUD, Enrollment | Partial |
| **Articles** | Artikel/Blog CRUD | Admin only for CUD |
| **Galleries** | Galeri gambar CRUD | Admin only for CUD |
| **Announcements** | Pengumuman CRUD | Admin only for CUD |
| **Categories & Tags** | Kategori & Tag CRUD | Admin only for CUD |
| **Organization** | Visi/Misi, Struktur, Program | Admin only for CUD |
| **Utility** | Calendar, Room, Contact, Feedback | Partial |

---

## Response Format

Semua response menggunakan format standar:

### Success Response
```json
{
  "success": true,
  "message": "Pesan sukses (opsional)",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Pesan error"
}
```

### Validation Error (422)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

---

## Business Rules

### Peminjaman Buku
- Maksimal **3 buku** aktif per user
- Periode peminjaman: **7 hari**
- Perpanjangan maksimal: **2 kali**
- Denda keterlambatan: **Rp.500/hari** (tidak dihitung Sabtu-Minggu)
- Buku dengan type `0` (Restricted) tidak bisa dipinjam

### User Roles
- `0`: Super Admin - akses penuh
- `1`: Admin - akses ke semua fitur admin
- `2`: User - akses fitur user biasa

### Announcement Types
- `0`: Pop-up
- `1`: Section

### Announcement Priority
- `0`: Low
- `1`: Standard
- `2`: Important

---

## Tips

1. **Gunakan Test tab** di Postman untuk auto-extract token:
   ```javascript
   var jsonData = pm.response.json();
   if (jsonData.data && jsonData.data.token) {
       pm.environment.set("token", jsonData.data.token);
   }
   ```

2. **Pre-request Script** untuk auto-refresh:
   Tambahkan script di Collection level untuk menangani token expiry

3. **Collection Runner** untuk run semua tests sekaligus
