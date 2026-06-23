<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\ReadingLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LeaderboardController extends Controller
{
    /**
     * Helper to compute current streak of a specific user.
     */
    private function getUserStreak($userId)
    {
        $dates = ReadingLog::where('user_id', $userId)
            ->select('read_date')
            ->groupBy('read_date')
            ->orderBy('read_date', 'desc')
            ->pluck('read_date')
            ->map(fn($date) => Carbon::parse($date))
            ->toArray();

        if (empty($dates)) {
            return 0;
        }

        $today = Carbon::today();
        $yesterday = Carbon::yesterday();
        $latestDate = $dates[0];

        if ($latestDate->equalTo($today) || $latestDate->equalTo($yesterday)) {
            $currentStreak = 1;
            for ($i = 0; $i < count($dates) - 1; $i++) {
                $diff = $dates[$i]->diffInDays($dates[$i + 1]);
                if ($diff === 1) {
                    $currentStreak++;
                } elseif ($diff > 1) {
                    break;
                }
            }
            return $currentStreak;
        }

        return 0;
    }

    /**
     * Display weekly and all-time reading leaderboards (publicly accessible).
     */
    public function index()
    {
        $startOfWeek = Carbon::now()->startOfWeek()->format('Y-m-d');
        $endOfWeek = Carbon::now()->endOfWeek()->format('Y-m-d');

        // 1. Weekly Leaderboard (Monday - Sunday)
        $weeklyRaw = ReadingLog::select('user_id', DB::raw('SUM(duration_seconds) as total_seconds'))
            ->whereBetween('read_date', [$startOfWeek, $endOfWeek])
            ->groupBy('user_id')
            ->orderBy('total_seconds', 'desc')
            ->limit(50)
            ->get();

        $weeklyUsers = $weeklyRaw->map(function ($row, $index) {
            $user = User::find($row->user_id);
            if (!$user) return null;
            return [
                'rank' => $index + 1,
                'user_id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar ? ((str_starts_with($user->avatar, 'http') || str_starts_with($user->avatar, 'data:')) ? $user->avatar : asset('storage/avatars/' . $user->avatar)) : null,
                'role' => $user->role,
                'duration_minutes' => round($row->total_seconds / 60, 1),
                'streak' => $this->getUserStreak($user->id),
            ];
        })->filter()->values();

        // 2. All-Time Leaderboard
        $allTimeRaw = ReadingLog::select('user_id', DB::raw('SUM(duration_seconds) as total_seconds'))
            ->groupBy('user_id')
            ->orderBy('total_seconds', 'desc')
            ->limit(50)
            ->get();

        $allTimeUsers = $allTimeRaw->map(function ($row, $index) {
            $user = User::find($row->user_id);
            if (!$user) return null;
            return [
                'rank' => $index + 1,
                'user_id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar ? ((str_starts_with($user->avatar, 'http') || str_starts_with($user->avatar, 'data:')) ? $user->avatar : asset('storage/avatars/' . $user->avatar)) : null,
                'role' => $user->role,
                'duration_hours' => round($row->total_seconds / 3600, 1),
                'streak' => $this->getUserStreak($user->id),
            ];
        })->filter()->values();

        // Find current user's ranks (only if authenticated)
        $myWeeklyRank = auth()->check() ? ($weeklyUsers->firstWhere('user_id', auth()->id())['rank'] ?? null) : null;
        $myAllTimeRank = auth()->check() ? ($allTimeUsers->firstWhere('user_id', auth()->id())['rank'] ?? null) : null;

        return Inertia::render('Home/Leaderboard', [
            'weeklyRankings' => $weeklyUsers,
            'allTimeRankings' => $allTimeUsers,
            'currentUserStats' => [
                'id' => auth()->id(),
                'weekly_rank' => $myWeeklyRank,
                'all_time_rank' => $myAllTimeRank,
                'streak' => auth()->check() ? $this->getUserStreak(auth()->id()) : 0,
            ]
        ]);
    }
}
