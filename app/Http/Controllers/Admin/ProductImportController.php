<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ProductImportService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ProductImportController extends Controller implements HasMiddleware
{
    /** @return array<int, Middleware> */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:create products'),
        ];
    }

    /**
     * Download template file (xlsx or csv).
     */
    public function downloadTemplate(Request $request, ProductImportService $service): BinaryFileResponse
    {
        $format = $request->query('format', 'xlsx') === 'csv' ? 'csv' : 'xlsx';
        $filePath = $service->generateTemplate($format);
        $fileName = "ronica_template_produk.{$format}";

        return response()->download($filePath, $fileName, [
            'Content-Type' => $format === 'csv'
                ? 'text/csv'
                : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Handle upload and import of products spreadsheet.
     */
    public function import(Request $request, ProductImportService $service): JsonResponse|RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv,txt', 'max:20480'], // max 20MB
            'update_existing' => ['nullable', 'boolean'],
        ], [
            'file.required' => 'Please select an Excel or CSV file first.',
            'file.mimes' => 'The file format must be .xlsx, .xls, or .csv.',
            'file.max' => 'The maximum file size is 20MB.',
        ]);

        /** @var UploadedFile $file */
        $file = $request->file('file');
        $updateExisting = $request->boolean('update_existing', false);

        try {
            $report = $service->import($file, $updateExisting);

            $successMsg = sprintf(
                'Import completed: %d products added, %d updated, %d skipped.',
                $report['imported'],
                $report['updated'],
                $report['skipped']
            );

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => $successMsg,
                    'report' => $report,
                ]);
            }

            return redirect()
                ->route('admin.products.index')
                ->with('success', $successMsg)
                ->with('import_report', $report);
        } catch (Exception $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                ], 422);
            }

            return redirect()
                ->back()
                ->withErrors(['file' => $e->getMessage()]);
        }
    }
}
