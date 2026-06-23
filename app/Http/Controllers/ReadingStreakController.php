<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ReadingLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReadingStreakController extends Controller
{
    /**
     * Get the reading streak statistics for a user.
     */
    private function getStreakStats($userId)
    {
        // Get all unique reading dates for this user, sorted descending
        $dates = ReadingLog::where('user_id', $userId)
            ->select('read_date')
            ->groupBy('read_date')
            ->orderBy('read_date', 'desc')
            ->pluck('read_date')
            ->map(fn($date) => Carbon::parse($date))
            ->toArray();

        if (empty($dates)) {
            return [
                'current_streak' => 0,
                'max_streak' => 0,
                'last_read_date' => null,
            ];
        }

        $today = Carbon::today();
        $yesterday = Carbon::yesterday();

        $latestDate = $dates[0];

        // If the latest read date is not today and not yesterday, current streak is 0
        $currentStreak = 0;
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
        }

        // Calculate maximum streak of all time
        $maxStreak = 0;
        $tempStreak = 0;
        if (count($dates) > 0) {
            $tempStreak = 1;
            $maxStreak = 1;
            for ($i = 0; $i < count($dates) - 1; $i++) {
                $diff = $dates[$i]->diffInDays($dates[$i + 1]);
                if ($diff === 1) {
                    $tempStreak++;
                    if ($tempStreak > $maxStreak) {
                        $maxStreak = $tempStreak;
                    }
                } elseif ($diff > 1) {
                    $tempStreak = 1;
                }
            }
        }

        return [
            'current_streak' => $currentStreak,
            'max_streak' => max($maxStreak, $currentStreak),
            'last_read_date' => $latestDate->format('Y-m-d'),
        ];
    }

    /**
     * Display the streak page and dashboard statistics.
     */
    public function index()
    {
        $userId = auth()->id();
        $todayStr = Carbon::today()->format('Y-m-d');

        // Streak stats
        $streaks = $this->getStreakStats($userId);

        // Today's reading duration
        $todayDurationSeconds = ReadingLog::where('user_id', $userId)
            ->where('read_date', $todayStr)
            ->sum('duration_seconds');

        // Total reading duration
        $totalDurationSeconds = ReadingLog::where('user_id', $userId)
            ->sum('duration_seconds');

        // Weekly progress (last 7 days)
        $weeklyProgress = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dateStr = $date->format('Y-m-d');
            $duration = ReadingLog::where('user_id', $userId)
                ->where('read_date', $dateStr)
                ->sum('duration_seconds');

            $weeklyProgress[] = [
                'day_name' => $date->isoFormat('dddd'), // e.g. Senin, Selasa
                'day_short' => $date->isoFormat('dd'), // e.g. Sn, Sl
                'date' => $dateStr,
                'duration_minutes' => round($duration / 60, 1),
            ];
        }

        return Inertia::render('Dashboard/Streak', [
            'stats' => [
                'current_streak' => $streaks['current_streak'],
                'max_streak' => $streaks['max_streak'],
                'today_minutes' => round($todayDurationSeconds / 60, 1),
                'total_hours' => round($totalDurationSeconds / 3600, 1),
                'weekly_progress' => $weeklyProgress,
            ],
            'user' => [
                'name' => auth()->user()->name,
                'avatar' => auth()->user()->avatar 
                    ? (str_starts_with(auth()->user()->avatar, 'http') ? auth()->user()->avatar : asset('storage/avatars/' . auth()->user()->avatar)) 
                    : null,
            ]
        ]);
    }

    /**
     * Handle active duration logging pings from the chapter reading page.
     */
    public function ping(Request $request)
    {
        $validated = $request->validate([
            'chapter_id' => 'nullable|exists:chapters,id',
            'duration_seconds' => 'required|integer|min:1|max:60',
        ]);

        $userId = auth()->id();
        $todayStr = Carbon::today()->format('Y-m-d');

        // Update or create reading log for today
        $log = ReadingLog::firstOrNew([
            'user_id' => $userId,
            'chapter_id' => $validated['chapter_id'],
            'read_date' => $todayStr,
        ]);

        $log->duration_seconds += $validated['duration_seconds'];
        $log->save();

        // Calculate new streak statistics
        $streaks = $this->getStreakStats($userId);

        // Get total duration today
        $todayDurationSeconds = ReadingLog::where('user_id', $userId)
            ->where('read_date', $todayStr)
            ->sum('duration_seconds');

        return response()->json([
            'success' => true,
            'current_streak' => $streaks['current_streak'],
            'max_streak' => $streaks['max_streak'],
            'today_minutes' => round($todayDurationSeconds / 60, 1),
            'daily_target_minutes' => (int) auth()->user()->daily_target_minutes,
        ]);
    }
}
