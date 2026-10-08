<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Dealer Partnership Inquiry</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f6f6f6;
            margin: 0;
            padding: 20px;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
        }
        .header {
            background-color: #111111;
            color: #ffffff;
            padding: 28px 24px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 700;
        }
        .content {
            padding: 28px 24px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .info-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #f3f4f6;
            font-size: 14px;
        }
        .info-table td.label {
            font-weight: 600;
            color: #4b5563;
            width: 140px;
        }
        .message-box {
            background-color: #f5f5f5;
            border-left: 4px solid #111111;
            padding: 16px;
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.6;
            white-space: pre-line;
            color: #1f2937;
        }
        .footer {
            background-color: #f9fafb;
            padding: 16px 24px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤝 New Dealer Partnership Inquiry</h1>
        </div>
        <div class="content">
            <p style="font-size: 15px; margin-top: 0;">You have received a new business partnership inquiry from the Hasibuan Design website.</p>
            
            <table class="info-table">
                <tr>
                    <td class="label">Name / Surname:</td>
                    <td><strong>{{ $inquiry->name }}</strong></td>
                </tr>
                <tr>
                    <td class="label">Email Address:</td>
                    <td><a href="mailto:{{ $inquiry->email }}" style="color: #111111;">{{ $inquiry->email }}</a></td>
                </tr>
                <tr>
                    <td class="label">Phone:</td>
                    <td>{{ $inquiry->phone ?: '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Date & Time:</td>
                    <td>{{ $inquiry->created_at->format('d M Y, H:i') }}</td>
                </tr>
            </table>

            <h3 style="font-size: 14px; margin-bottom: 8px; color: #374151;">Message:</h3>
            <div class="message-box">
                {{ $inquiry->message }}
            </div>
        </div>
        <div class="footer">
            Hasibuan Design • Automated Notification
        </div>
    </div>
</body>
</html>
