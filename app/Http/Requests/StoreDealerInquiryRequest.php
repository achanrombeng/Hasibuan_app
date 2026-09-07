<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreDealerInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $contact = trim((string) ($this->contact ?? $this->email ?? $this->phone ?? ''));

        if ($contact !== '') {
            $this->merge(['contact' => $contact]);
            if (filter_var($contact, FILTER_VALIDATE_EMAIL)) {
                $this->merge(['email' => $contact]);
            } else {
                $this->merge(['phone' => $contact]);
            }
        }
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'contact' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'message' => ['required', 'string', 'max:5000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'contact.required' => 'Email/Phone wajib diisi.',
            'message.required' => 'Pesan wajib diisi.',
        ];
    }
}
