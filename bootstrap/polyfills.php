<?php

// Polyfill request_parse_body for PHP < 8.4 (used by newer Symfony/HttpFoundation versions)
if (!function_exists('request_parse_body')) {
    function request_parse_body(): array
    {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (str_contains($contentType, 'application/x-www-form-urlencoded')) {
            parse_str(file_get_contents('php://input'), $data);
            return [$data, []];
        }
        if (str_contains($contentType, 'application/json')) {
            $data = json_decode(file_get_contents('php://input'), true);
            return [is_array($data) ? $data : [], []];
        }
        return [[], []];
    }
}
