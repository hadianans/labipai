-- tabel data user
CREATE TABLE `user` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(255),
  `email` varchar(255),
  `password` varchar(255),
  `role` enum('0','1','2'), -- 0: super admin, 1: admin, 2: user
  `phone` varchar(255),
  `img_url` varchar(255), -- link photo profile. maksimal: 1Mb
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel data pengurus laboratorium
CREATE TABLE `administrator` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `position` varchar(255), -- semacam jabatan, yang tersedia sekarang adalah: Pelindung, Penanjungjawab, Ketua, Koordinator, Staff
  `division` varchar(255), -- peran spesifik dalam jabaran, yang tersedia sementara adalah: Laboratorium, Sekretaris, Bendahara, Departemen, Badan Semi Independen, Program Pintar Baca Qur'an, Halaqoh Tahfizh Mahasiswa
  `is_chief` boolean, -- position !staff = true. untuk mengidentifikasi pimpinan. jika dia pimpinan, maka profilenya akan dipajang, dan pada detail akan lebih dulu dibandingkan anggotanya
  `year` int, -- periode tahun kepengurusan
  `img_url` varchar(255), -- link photo profile. maksimal: 1Mb
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel visi kepengurusan laboratorium
CREATE TABLE `vision` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `vision` varchar(255), -- deskripsi visi
  `year` int, -- periode tahun kepengurusan
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel misi kepengurusan
CREATE TABLE `mission_point` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `vision_id` int,
  `mission` varchar(255), -- poin misi kepengurusan
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel daftar departemen yang berada di laboratorium
CREATE TABLE `department` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255), -- nama departemen. yang sekarang tersedia ada: Rumah Tangga, Media, Informasi Teknologi, dan Kajian Keilmuan. karena fleksibel, jumlah departemen bisa berkurang atau bertambah
  `description` varchar(255), -- deksripsi tugas dan fungsi dari masing-masing departemen
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel untuk menghubungkan pengurus ke departemennya masing-masing jika terdaftar sebagai bagian departemen
CREATE TABLE `department_member` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `department_id` int,
  `administrator_id` int,
  `year` int, -- periode tahun kepengurusan
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel informasi program yang diseleggarakan laboratorium
CREATE TABLE `program` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255), -- nama program yang terdaftar di laboratorium. sekarang baru ada 2: Program Pintar Baca Qur'an (PPBQ) & Halaqoh Tahfizh Mahasiswa (Hamasah)
  `description` varchar(255), -- deskripsi program
  `detail_url` varchar(255), -- informasi detail program bisa diisi dengan link kepada artikel tertentu/halaman website khusus masing-masing program
  `img_url` varchar(255), -- gambar latar program. maksimal: 1Mb
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel untuk menghubungkan pengurus ke programnya masing-masing jika terdaftar sebagai penyelenggara program
CREATE TABLE `program_member` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `program_id` int,
  `administrator_id` int,
  `year` int, -- periode tahun kepengurusan
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel data buku yang tersedia di laboratorium
CREATE TABLE `book` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255),
  `author` varchar(255),
  `editor` varchar(255),
  `translator` varchar(255),
  `publisher` varchar(255),
  `year` int,
  `language` varchar(255),
  `page` int,
  `volume` int,
  `synopsis` text,
  `isbn` varchar(255),
  `type` enum('0','1'), -- 0: Restricted, 1: Open Access. buku dengan type 1 (Open Access) dapat dipinjam, sedangkan 0 (Retricted) tidak dapat dipinjam
  `status` enum('0','1','2'), -- 0: tersedia, 1: dipinjam, 2: hilang
  `img_url` varchar(255), -- gambar cover buku. maksimal: 1Mb
  `created_at` datetime,
  `updated_at` datetime
);
 -- tabel untuk menghimpun buku identik. sehingga cukup ditampilkan 1 frame kemudian pada detail terdapat jumlah copy yang tersedia beserta id masing-masing
CREATE TABLE `book_copy` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `book_id` int,
  `copy` int,
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel daftar genre untuk mengelompokan buku
CREATE TABLE `genre` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `genre` varchar(255),
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel untuk menghubungkan buku dengan beberapa genre
CREATE TABLE `book_genre` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `book_id` int,
  `genre_id` int,
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel untuk peminjaman buku. durasi peminjaman 7 hari sejak peminjaman. bisa diperpanjang 2 kali (total 3 pekan). maksimal peminjaman 3 buku aktif. jika sudah 3 buku dan ingin meminjam lagi maka harus mengembalikan salah satunya dahulu
CREATE TABLE `book_lend` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `book_id` int,
  `user_id` int,
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel denda ketika telat dalam pengembalian. jika telat, denda Rp.500/hari tapi tidak akan bertambah/dihitung pada hari libur yaitu sabtu dan minggu
CREATE TABLE `book_fine` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `lend_id` int,
  `amount` decimal,
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel untuk merekap buku favorite masing-masing user
CREATE TABLE `book_favorite` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `book_id` int,
  `user_id` int,
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel penilaian/review dari user terhadap buku tertentu
CREATE TABLE `book_review` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `book_id` int,
  `user_id` int,
  `star` int, -- jumlah bintang penilaian user. maks: 5
  `review` varchar(255), -- penilaian deksriptif user
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel gallery kegiatan laboratorium
CREATE TABLE `gallery` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255),
  `description` varchar(255),
  `alt_text` varchar(255),
  `img_url` varchar(255),
  `is_hero` boolean, -- pada halaman beranda terdapat hero section dengan gambar dan text call to action, terdapat 3 slide. jika is_hero true, maka akan digunakan sebagai latar pada hero section. jika ada lebih dari 3 gambar maka akan dipilih random dari record dengan is_hero true
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel daftar tag untuk mengelompokan gambar dan memberi identitas pada gallery
CREATE TABLE `tag` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel untuk menghubungkan gambar dengan beberapa tag
CREATE TABLE `gallery_tag` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `gallery_id` int,
  `tag_id` int,
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel untuk menyimpan data artikel
CREATE TABLE `article` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `slug` varchar(255),
  `title` varchar(255),
  `excerpt` varchar(255),
  `content` text,
  `status` enum(0,1), -- 0: archive, 1: publish
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel untuk menghubungkan asset artikel berupa satu atau beberapa gambar yang menjadi konten artikel
CREATE TABLE `article_assets` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `article_id` int,
  `img_url` varchar(255),
  `alt_text` varchar(255),
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel category untuk mengelompokan artikel yang relevan
CREATE TABLE `category` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `category` varchar(255),
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel untuk menghubungkan artikel ke beberapa kategori
CREATE TABLE `article_category` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `article_id` int,
  `category_id` int,
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel yang menghimpun informasi kontak yang dihubungi
CREATE TABLE `contact` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `type` varchar(255), -- jenis media, contoh: email, whatsapp, instagram, twitter, youtube, telegram, dll
  `contact` varchar(255), -- informasi atau isi dari kontaknya. misal, whatsapp: 0895-354488-400, instagram: @baitulhikmah.ipai.upi
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel untuk melakukan booking ruangan
CREATE TABLE `room` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255),
  `description` varchar(255),
  `start_time` datetime, -- waktu dimulainya acara
  `end_time` datetime, -- waktu selesainya acara
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel informasi waktu kegiatan yang diselenggarakan laboratorium
CREATE TABLE `callendar` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255),
  `description` varchar(255),
  `start_time` datetime,
  `end_time` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel pengumuman
CREATE TABLE `announcement` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255),
  `content` text,
  `img_url` varchar(255), -- pengumuman bisa berisi text saja, gambar saja, atau keduanya. atur posisinya agar tetap responsive
  `action_url` varchar(255), -- jika pengumuman memerlukan detail lebih lengkap bisa menambahkan link untuk mengarahkan ke sumber informasi seperti artikel, postingan, kontak, dll. jika ini diisi maka akan menjadi tombol call to action pada tampilan pengumuman
  `priority` enum('0','1','2'), -- 0: rendah, 1: standar, 2: penting // pengumuman akan lebih banyak ditampilkan jika tingkan urgensi/valuenya semakin tinggi
  `type` enum('0','1'), -- 0: pop-up, 1: section. type pop-up maka pengumuman akan berupa pop-up ketika user pertama kali mengunjungi web di beranda, jika section maka sistem akan membuat section khusus untuk pengumuman di halaman beranda.
  `status` enum('0','1'), -- 0: draft, 1: publish
  `start_date` datetime, -- tanggal awal pengumuman publish ditampilkan
  `end_date` datetime, -- tanggal akhir pengumuman publish ditampilkan
  `created_at` datetime,
  `updated_at` datetime
);


-- tabel untuk menyimpan feedback dari authenticated user
CREATE TABLE `feedback` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int, -- jika user memilih anonymous true maka user_id nya tidak adan terekam
  `subject` varchar(255),
  `message` text,
  `is_anonymous` boolean, jika user memilih anonymous, maka true
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel informasi course yang ada di laboratorium
CREATE TABLE `course` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255),
  `description` varchar(255),
  `status` enum(0,1), -- 0: draft, 1: published
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel modul yang berada pada course
CREATE TABLE `course_module` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `course_id` int,
  `title` varchar(255),
  `description` varchar(255),
  `order` int, -- urutan modul
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel untuk media pembelajaran yang terdapat pada modul
CREATE TABLE `course_content` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `module_id` int,
  `type` enum('0','1'), -- 0: text, 1: video. jika text berasal dari artikel internal maka copy linknya dan sistem akan mengambil content article dan memasukannya ke halaman khusus materi, jika dia dari google drive maka akan embed dengan tampilan preview yang cocok. jika type video maka dia akan embed, misal dari youtube
  `title` varchar(255),
  `content_url` varchar(255), -- link menuju media pembelajaran
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel untuk mencatat authenticated user yang mengambil course
CREATE TABLE `course_enrollment` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `course_id` int,
  `user_id` int,
  `enrolled_at` datetime,
  `progress` int, -- persentase progres belajar berdasarkan materi yang diselesaikan
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel untuk mencatat aktivitas user pada course
CREATE TABLE `activity_log` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `course_id` int,
  `content_id` int,
  `status` enum('0','1'), -- 0: undone, 1: done
  `timestamp` datetime, -- waktu akses user terhadap materi
  `created_at` datetime,
  `updated_at` datetime
);

-- tabel review user terhadap course
CREATE TABLE `course_review` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `course` int,
  `user_id` int,
  `star` int, -- jumlah bintang penilaian. maks: 5
  `review` varchar(255),
  `created_at` datetime,
  `updated_at` datetime
);

ALTER TABLE `mission_point` ADD FOREIGN KEY (`vision_id`) REFERENCES `vision` (`id`);

ALTER TABLE `department_member` ADD FOREIGN KEY (`department_id`) REFERENCES `department` (`id`);

ALTER TABLE `department_member` ADD FOREIGN KEY (`administrator_id`) REFERENCES `administrator` (`id`);

ALTER TABLE `program_member` ADD FOREIGN KEY (`program_id`) REFERENCES `program` (`id`);

ALTER TABLE `program_member` ADD FOREIGN KEY (`administrator_id`) REFERENCES `administrator` (`id`);

ALTER TABLE `book_copy` ADD FOREIGN KEY (`book_id`) REFERENCES `book` (`id`);

ALTER TABLE `book_genre` ADD FOREIGN KEY (`book_id`) REFERENCES `book` (`id`);

ALTER TABLE `book_genre` ADD FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`);

ALTER TABLE `book_lend` ADD FOREIGN KEY (`book_id`) REFERENCES `book` (`id`);

ALTER TABLE `book_lend` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `book_fine` ADD FOREIGN KEY (`lend_id`) REFERENCES `book_lend` (`id`);

ALTER TABLE `book_favorite` ADD FOREIGN KEY (`book_id`) REFERENCES `book` (`id`);

ALTER TABLE `book_favorite` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `book_review` ADD FOREIGN KEY (`book_id`) REFERENCES `book` (`id`);

ALTER TABLE `book_review` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `gallery_tag` ADD FOREIGN KEY (`gallery_id`) REFERENCES `gallery` (`id`);

ALTER TABLE `gallery_tag` ADD FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`);

ALTER TABLE `article_assets` ADD FOREIGN KEY (`article_id`) REFERENCES `article` (`id`);

ALTER TABLE `article_category` ADD FOREIGN KEY (`article_id`) REFERENCES `article` (`id`);

ALTER TABLE `article_category` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

ALTER TABLE `feedback` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `course_module` ADD FOREIGN KEY (`course_id`) REFERENCES `course` (`id`);

ALTER TABLE `course_content` ADD FOREIGN KEY (`module_id`) REFERENCES `course_module` (`id`);

ALTER TABLE `course_enrollment` ADD FOREIGN KEY (`course_id`) REFERENCES `course` (`id`);

ALTER TABLE `course_enrollment` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `activity_log` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `activity_log` ADD FOREIGN KEY (`course_id`) REFERENCES `course` (`id`);

ALTER TABLE `activity_log` ADD FOREIGN KEY (`content_id`) REFERENCES `course_content` (`id`);

ALTER TABLE `course_review` ADD FOREIGN KEY (`course`) REFERENCES `course` (`id`);

ALTER TABLE `course_review` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);