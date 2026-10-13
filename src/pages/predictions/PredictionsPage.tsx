import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAvailableEvents, useVisionScore } from '@/hook/usePredictionsDev';
import EventCard, { EventCardCompact } from '@/component/predictions/EventCard';
import LeaderboardView, { LeaderboardViewCompact } from '@/component/predictions/LeaderboardView';
import HistoryTable, { HistoryTableCompact } from '@/component/predictions/HistoryTable';
import VisionScoreBadge from '@/component/predictions/VisionScoreBadge';
import StreakBonusAnimation, { StreakBonusCompact } from '@/component/predictions/StreakBonusAnimation';
import { usePredictionToast } from '@/component/predictions/PredictionToast';

export default function PredictionsPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'leaderboard' | 'history'>('events');
  const [showStreakBonus, setShowStreakBonus] = useState(false);
  const [lastStreak, setLastStreak] = useState(0);
  
  const { data: events, isLoading: eventsLoading, error: eventsError } = useAvailableEvents();
  const { data: visionScore, isLoading: visionLoading } = useVisionScore();
  const { showSuccess, showError } = usePredictionToast();

  // Check for streak bonus
  useEffect(() => {
    if (visionScore && visionScore.streak > lastStreak && lastStreak > 0) {
      setShowStreakBonus(true);
    }
    if (visionScore) {
      setLastStreak(visionScore.streak);
    }
  }, [visionScore, lastStreak]);

  const tabs = [
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'history', label: 'History', icon: '📊' },
  ] as const;

  const upcomingEvents = events?.items.filter(event => event.status === 'upcoming') || [];
  const passedEvents = events?.items.filter(event => event.status === 'passed') || [];

  if (eventsError) {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-400 py-12">
            <h2 className="text-2xl font-bold mb-4">Failed to load predictions</h2>
            <p className="mb-4">There was an error loading the economic events.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Economic Predictions</h1>
              <p className="text-gray-400 mt-1">Make predictions on economic events and compete with other traders</p>
            </div>
            
            {!visionLoading && visionScore && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400">Your Vision Score</div>
                  <VisionScoreBadge score={visionScore.score} size="lg" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Current Streak</div>
                  <div className="text-2xl font-bold text-orange-400">{visionScore.streak}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Tabs */}
        <div className="lg:hidden mb-6">
          <div className="flex bg-gray-800 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }
                `}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {activeTab === 'events' && (
              <div className="space-y-8">
                {/* Upcoming Events */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
                  {eventsLoading ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-48 bg-gray-800 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : upcomingEvents.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {upcomingEvents.map((event) => (
                        <EventCard key={event.event_id} event={event} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-12">
                      <p className="text-lg">No upcoming events at the moment</p>
                    </div>
                  )}
                </section>

                {/* Passed Events */}
                {passedEvents.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Recent Events</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {passedEvents.slice(0, 4).map((event) => (
                        <EventCard key={event.event_id} event={event} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <LeaderboardView />
            )}

            {activeTab === 'history' && (
              <HistoryTable />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <LeaderboardViewCompact />
            <HistoryTableCompact pageSize={5} />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {activeTab === 'events' && (
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-bold text-white mb-4">Upcoming Events</h2>
                {eventsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-20 bg-gray-800 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <EventCardCompact key={event.event_id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <p>No upcoming events at the moment</p>
                  </div>
                )}
              </section>

              {passedEvents.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">Recent Events</h2>
                  <div className="space-y-3">
                    {passedEvents.slice(0, 3).map((event) => (
                      <EventCardCompact key={event.event_id} event={event} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardViewCompact />
          )}

          {activeTab === 'history' && (
            <HistoryTableCompact />
          )}
        </div>
      </div>

      {/* Streak Bonus Animation */}
      <StreakBonusAnimation
        streak={visionScore?.streak || 0}
        isVisible={showStreakBonus}
        onComplete={() => setShowStreakBonus(false)}
      />
    </div>
  );
}
