<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['admin', 'super-admin']);
        })->first() ?? User::first();

        $articles = [
            [
                'title' => 'Tips Memilih Furniture yang Tepat untuk Ruang Tamu',
                'excerpt' => 'Ruang tamu adalah wajah rumah Anda. Pelajari cara memilih furniture yang tepat untuk menciptakan kesan pertama yang sempurna bagi tamu Anda.',
                'content' => "# Tips Memilih Furniture yang Tepat untuk Ruang Tamu\n\nRuang tamu adalah area pertama yang dilihat tamu saat memasuki rumah Anda. Oleh karena itu, pemilihan furniture yang tepat sangat penting.\n\n## Pertimbangan Ukuran\n\nPastikan furniture yang Anda pilih sesuai dengan ukuran ruangan. Jangan sampai ruang tamu terlihat sesak atau justru terlalu kosong.\n\n## Warna dan Gaya\n\nPilih warna yang selaras dengan tema interior rumah Anda. Gaya minimalis modern atau klasik elegan, semuanya bisa disesuaikan dengan kebutuhan.\n\n## Kualitas Material\n\nInvestasi pada furniture berkualitas tinggi akan menghemat biaya jangka panjang. Pilih material yang tahan lama seperti kayu jati atau mahoni.\n\n## Fungsi dan Kenyamanan\n\nSelain estetika, pertimbangkan juga fungsi dan kenyamanan. Sofa yang empuk dan meja yang fungsional akan membuat ruang tamu lebih nyaman.",
                'author' => $admin->name ?? 'Admin Ronica',
                'author_id' => $admin->id ?? null,
                'status' => ArticleStatus::PUBLISHED,
                'tags' => ['Tips', 'Ruang Tamu', 'Furniture', 'Interior Design'],
                'published_at' => now()->subDays(7),
            ],
            [
                'title' => 'Tren Furniture 2026: Minimalis dan Ramah Lingkungan',
                'excerpt' => 'Tahun 2026 membawa tren furniture yang lebih minimalis dan ramah lingkungan. Simak tren terbaru yang bisa Anda aplikasikan di rumah.',
                'content' => "# Tren Furniture 2026\n\n## Desain Minimalis\n\nTren minimalis masih menjadi favorit di tahun 2026. Furniture dengan desain sederhana namun fungsional semakin diminati.\n\n## Material Ramah Lingkungan\n\nKesadaran akan lingkungan membuat material seperti bambu dan kayu daur ulang semakin populer.\n\n## Warna Natural\n\nPalet warna natural seperti earth tone mendominasi pilihan warna furniture tahun ini.\n\n## Multifungsi\n\nFurniture multifungsi seperti sofa bed dan meja lipat menjadi solusi untuk rumah dengan ruang terbatas.",
                'author' => $admin->name ?? 'Admin Ronica',
                'author_id' => $admin->id ?? null,
                'status' => ArticleStatus::PUBLISHED,
                'tags' => ['Tren', 'Minimalis', 'Eco-Friendly', '2026'],
                'published_at' => now()->subDays(3),
            ],
            [
                'title' => 'Cara Merawat Furniture Kayu agar Awet Bertahun-tahun',
                'excerpt' => 'Furniture kayu membutuhkan perawatan khusus agar tetap awet dan indah. Berikut panduan lengkap merawat furniture kayu Anda.',
                'content' => "# Cara Merawat Furniture Kayu\n\n## Pembersihan Rutin\n\nBersihkan furniture kayu secara rutin dengan kain lembut yang sedikit lembab. Hindari penggunaan bahan kimia keras.\n\n## Hindari Paparan Langsung Matahari\n\nSinar matahari langsung dapat membuat warna kayu memudar. Gunakan tirai atau gorden untuk melindungi furniture.\n\n## Gunakan Polish Khusus\n\nGunakan polish kayu berkualitas setiap 3-6 bulan sekali untuk menjaga kilau dan melindungi permukaan kayu.\n\n## Jaga Kelembaban\n\nKelembaban yang terlalu tinggi atau rendah dapat merusak kayu. Gunakan humidifier atau dehumidifier jika diperlukan.",
                'author' => $admin->name ?? 'Admin Ronica',
                'author_id' => $admin->id ?? null,
                'status' => ArticleStatus::PUBLISHED,
                'tags' => ['Perawatan', 'Furniture Kayu', 'Tips'],
                'published_at' => now()->subDay(),
            ],
        ];

        foreach ($articles as $articleData) {
            $wordCount = str_word_count(strip_tags($articleData['content']));
            $articleData['read_time'] = (int) ceil($wordCount / 200);

            Article::create($articleData);
        }
    }
}
