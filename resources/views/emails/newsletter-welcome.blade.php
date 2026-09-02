<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to {{ $siteName }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 24px 16px;
            color: #334155;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #0d9488;
            color: #ffffff;
            padding: 36px 32px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.025em;
        }
        .header p {
            margin: 0;
            font-size: 15px;
            color: #ccfbf1;
        }
        .content {
            padding: 36px 32px;
            line-height: 1.7;
            font-size: 15px;
        }
        .highlight-box {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
            color: #166534;
        }
        .highlight-box h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
            font-weight: 600;
        }
        .highlight-box ul {
            margin: 0;
            padding-left: 20px;
            font-size: 14px;
        }
        .highlight-box li {
            margin-bottom: 6px;
        }
        .btn {
            display: inline-block;
            background-color: #f59e0b;
            color: #ffffff !important;
            font-weight: 600;
            font-size: 15px;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 10px;
            margin: 16px 0;
            text-align: center;
        }
        .footer {
            background-color: #f8fafc;
            padding: 24px 32px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
        }
        .footer a {
            color: #0d9488;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌿 Welcome to {{ $siteName }}</h1>
            <p>Thank you for subscribing to our newsletter</p>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>We're thrilled to welcome you to the <strong>{{ $siteName }}</strong> family! You're now subscribed to receive our latest updates directly to your inbox.</p>
            
            <div class="highlight-box">
                <h3>What you can look forward to:</h3>
                <ul>
                    <li>Exclusive access to new outdoor furniture collections</li>
                    <li>Design inspiration and outdoor living tips</li>
                    <li>Special seasonal promotions and subscriber-only offers</li>
                    <li>Invitations to private showroom showcases</li>
                </ul>
            </div>

            <div style="text-align: center; margin: 28px 0;">
                <a href="{{ url('/') }}" class="btn">Explore Our Collections &rarr;</a>
            </div>

            <p style="margin-bottom: 0; font-size: 14px; color: #64748b;">
                Best regards,<br>
                <strong>The {{ $siteName }} Team</strong>
            </p>
        </div>
        <div class="footer">
            <p style="margin: 0 0 8px 0;">{{ $siteName }} • Premium Outdoor Furniture</p>
            <p style="margin: 0;">Have questions? Contact us at <a href="mailto:{{ $contactEmail }}">{{ $contactEmail }}</a></p>
        </div>
    </div>
</body>
</html>
