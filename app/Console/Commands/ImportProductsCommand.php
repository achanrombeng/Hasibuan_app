<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\ProductImportService;
use Illuminate\Console\Command;
use Throwable;

class ImportProductsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:import 
                            {file : Path ke file Excel (.xlsx/.xls) atau CSV}
                            {--update : Perbarui data jika SKU atau Nama produk sudah ada}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import produk massal dari file spreadsheet Excel atau CSV';

    /**
     * Execute the console command.
     */
    public function handle(ProductImportService $service): int
    {
        $file = (string) $this->argument('file');
        $update = (bool) $this->option('update');

        if (! file_exists($file)) {
            $this->error("File tidak ditemukan di path: {$file}");

            return self::FAILURE;
        }

        $this->info("Memulai proses import produk dari: {$file}");
        if ($update) {
            $this->comment('Mode update aktif: Produk yang sudah ada akan diperbarui.');
        }

        try {
            $report = $service->import($file, $update);

            $this->newLine();
            $this->info('=== Laporan Hasil Import ===');
            $this->line("Total Baris Diproses: {$report['total_rows']}");
            $this->info("✓ Berhasil Ditambahkan : {$report['imported']}");
            $this->comment("↻ Berhasil Diperbarui   : {$report['updated']}");
            $this->warn("⚠ Dilewati / Tidak Ada  : {$report['skipped']}");

            if (! empty($report['errors'])) {
                $this->newLine();
                $this->warn('Detail Catatan / Error:');
                $headers = ['Baris', 'SKU', 'Pesan'];
                $rows = array_map(fn ($err) => [$err['row'], $err['sku'], $err['message']], $report['errors']);
                $this->table($headers, $rows);
            }

            $this->newLine();
            $this->info('Import produk selesai dengan sukses!');

            return self::SUCCESS;
        } catch (Throwable $e) {
            $this->error('Gagal melakukan import: '.$e->getMessage());

            return self::FAILURE;
        }
    }
}
