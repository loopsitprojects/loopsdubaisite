<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Inquiry Notification</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #0c0e12;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #ffffff;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            background-color: #0c0e12;
            padding: 30px 15px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #12151c;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }
        .header {
            padding: 32px 32px 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            background: linear-gradient(180deg, #161a23 0%, #12151c 100%);
        }
        .brand-title {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #ffffff;
            margin: 0 0 8px 0;
        }
        .brand-title span {
            color: #14f1d9;
        }
        .badge {
            display: inline-block;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #14f1d9;
            background-color: rgba(20, 241, 217, 0.12);
            border: 1px solid rgba(20, 241, 217, 0.25);
            padding: 4px 10px;
            border-radius: 999px;
            margin-bottom: 8px;
        }
        .subtitle {
            font-size: 13px;
            color: #9ca3af;
            margin: 0;
        }
        .body-content {
            padding: 28px 32px;
        }
        .lead-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
        }
        .lead-table tr {
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .lead-table tr:last-child {
            border-bottom: none;
        }
        .lead-table td {
            padding: 12px 0;
            vertical-align: top;
            font-size: 14px;
        }
        .label {
            width: 32%;
            color: #9ca3af;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .value {
            color: #ffffff;
            font-weight: 500;
        }
        .value a {
            color: #14f1d9;
            text-decoration: none;
        }
        .value a:hover {
            text-decoration: underline;
        }
        .message-box {
            background-color: #090a0e;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 16px;
            margin-top: 6px;
            color: #e5e7eb;
            font-size: 13.5px;
            line-height: 1.6;
            white-space: pre-wrap;
        }
        .cta-container {
            padding: 10px 0 20px;
            text-align: center;
        }
        .cta-button {
            display: inline-block;
            background-color: #14f1d9;
            color: #000000 !important;
            font-weight: 700;
            font-size: 13px;
            padding: 12px 28px;
            border-radius: 999px;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(20, 241, 217, 0.3);
        }
        .footer {
            padding: 20px 32px;
            background-color: #0a0c10;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            text-align: center;
            font-size: 11px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <span class="badge">New Lead Notification</span>
                <h1 class="brand-title">Loops <span>Integrated</span></h1>
                <p class="subtitle">A new client inquiry has been submitted through the live website.</p>
            </div>

            <div class="body-content">
                <table class="lead-table">
                    <tr>
                        <td class="label">Client Name</td>
                        <td class="value"><strong>{{ $booking->name }}</strong></td>
                    </tr>
                    <tr>
                        <td class="label">Email Address</td>
                        <td class="value">
                            <a href="mailto:{{ $booking->email }}">{{ $booking->email }}</a>
                        </td>
                    </tr>
                    @if($booking->phone)
                    <tr>
                        <td class="label">Phone</td>
                        <td class="value">
                            <a href="tel:{{ $booking->phone }}">{{ $booking->phone }}</a>
                        </td>
                    </tr>
                    @endif
                    @if($booking->company)
                    <tr>
                        <td class="label">Company / Brand</td>
                        <td class="value">{{ $booking->company }}</td>
                    </tr>
                    @endif
                    <tr>
                        <td class="label">Requested Service</td>
                        <td class="value">
                            <span style="color: #14f1d9; font-weight: 600;">{{ $booking->service_type ?: 'AI Video Production' }}</span>
                        </td>
                    </tr>
                    @if($booking->preferred_timeline)
                    <tr>
                        <td class="label">Timeline</td>
                        <td class="value">{{ $booking->preferred_timeline }}</td>
                    </tr>
                    @endif
                    @if($booking->message)
                    <tr>
                        <td class="label">Project Brief</td>
                        <td class="value">
                            <div class="message-box">{{ $booking->message }}</div>
                        </td>
                    </tr>
                    @endif
                </table>

                <div class="cta-container">
                    <a href="{{ rtrim(config('app.url', 'https://uae.loopsintegrated.com'), '/') . '/admin' }}" class="cta-button" target="_blank">
                        Open Admin Dashboard →
                    </a>
                </div>
            </div>

            <div class="footer">
                This is an automated notification from {{ config('app.name', 'Loops Integrated') }} at {{ config('app.url', 'https://uae.loopsintegrated.com') }}.<br>
                You can reply directly to this email to respond to <strong>{{ $booking->name }}</strong>.
            </div>
        </div>
    </div>
</body>
</html>
