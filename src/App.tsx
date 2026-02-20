/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  History,
  Lightbulb,
  Target,
  Settings as SettingsIcon,
  Bell,
  Search,
  Bolt,
  User,
  Shield,
  ArrowRight,
  Clock,
  Moon,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Download,
  Wind,
  Dumbbell,
  Ban,
  Brain,
  TrendingUp,
  TrendingDown,
  Info,
  Activity as ActivityIcon
} from 'lucide-react';
import { storageService } from './storage.js';
import { motion, AnimatePresence } from 'motion/react';
import FatigueTracker from './components/FatigueTracker';

// --- Types ---
interface Settings {
  full_name: string;
  email: string;
  role: string;
  daily_focus_target: number;
  max_tab_switches: number;
  digital_sunset: string;
  alert_sensitivity: string;
  auto_trigger_breathing: number;
  block_notifications: number;
  smart_breaks: number;
  burnout_alerts_level: number;
  micro_break_interval: string;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  score_impact: number;
}

interface EventLog {
  id: number;
  timestamp: string;
  event_type: string;
  message: string;
}

interface Stats {
  focus_score: number;
  active_time: string;
  idle_time: string;
  tab_switches: number;
  session_duration: string;
  score_improvement: number;
  interventions: number;
  burnout_trend: number[];
  distraction_peak: string;
}

// --- Components ---

const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all relative ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
      }`}
  >
    <Icon size={18} />
    {label}
    {active && (
      <motion.div
        layoutId="nav-underline"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
      />
    )}
  </button>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left ${active
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold'
      : 'text-slate-600 hover:bg-slate-100'
      }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-blue-600' : 'bg-slate-300'
      }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
        }`}
    />
  </button>
);

// --- Pages ---

const InsightsPage = ({ stats }: { stats: Stats | null }) => {
  if (!stats) return null;
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap justify-between items-end gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-blue-600/10 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded">Analytics Engine</span>
          </div>
          <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">Pattern Intelligence</h1>
          <p className="text-slate-500 text-lg font-medium">Deep dive into your cognitive focus and recovery trends.</p>
        </div>
        <div className="flex items-center bg-slate-200/50 p-1 rounded-xl backdrop-blur-sm">
          <button className="px-5 py-2 text-sm font-bold rounded-lg transition-all text-slate-500">Day</button>
          <button className="px-5 py-2 text-sm font-bold rounded-lg bg-white shadow-sm text-slate-900">Week</button>
          <button className="px-5 py-2 text-sm font-bold rounded-lg transition-all text-slate-500">Month</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-rose-50 border border-rose-100 p-10 flex flex-col justify-between group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <AlertTriangle className="text-rose-600" size={160} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-rose-600" size={16} />
              <span className="text-rose-600 font-bold uppercase tracking-widest text-[10px]">Critical Insight</span>
            </div>
            <h3 className="text-slate-900 text-3xl font-extrabold mb-3">Approaching Burnout</h3>
            <p className="text-slate-600 text-base max-w-xl mb-8 leading-relaxed">
              Warning: Rising tab switching frequency (+42%) and late-night usage detected over the last 72 hours. Your cognitive load is exceeding recommended recovery limits.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4 items-center">
            <button className="bg-rose-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-rose-700 transition-all flex items-center gap-2 shadow-lg shadow-rose-600/20">
              <Zap size={18} />
              Start Guided Recovery
            </button>
            <span className="text-rose-600/80 text-sm font-semibold italic">Peak drop detected: 2:00 PM - 4:00 PM</span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-8">Focus Stability</p>
          <div className="relative flex items-center justify-center size-44 mb-8">
            <svg className="size-full" viewBox="0 0 100 100">
              <circle className="text-slate-100" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="10"></circle>
              <motion.circle
                className="text-blue-600"
                cx="50" cy="50" fill="none" r="45"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                initial={{ strokeDashoffset: 282.7 }}
                animate={{ strokeDashoffset: 70 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{
                  strokeDasharray: 282.7,
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'center',
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">HIGH</span>
              <span className="text-emerald-500 font-bold text-sm">+5.2%</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed max-w-[200px]">
            Your focus depth remains resilient despite increased interruptions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-8 flex flex-col gap-8 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-900 text-xl font-extrabold tracking-tight">Weekly Cognitive Trend</h3>
            <div className="flex gap-6 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-blue-600"></div> Focus Score
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 border-b-2 border-dashed border-slate-300"></div> Interventions
              </div>
            </div>
          </div>
          <div className="h-80 w-full relative bg-slate-50/50 rounded-2xl flex items-end justify-between px-10 pb-10 border border-slate-100">
            {/* Mock Chart */}
            <div className="flex justify-between w-full items-end h-48 px-2">
              {[70, 50, 85, 40, 65, 95, 60].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-4 w-10">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="w-3 bg-blue-600 rounded-full relative"
                  />
                  <span className="text-[10px] font-bold text-slate-400">{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-slate-200 p-8 flex flex-col gap-8 shadow-sm">
          <h3 className="text-slate-900 text-xl font-extrabold tracking-tight">Recovery Lift</h3>
          <div className="flex flex-col gap-8 flex-1 justify-center">
            {[
              { label: 'Focus Blocks', val: 88 },
              { label: 'Stretching', val: 62 },
              { label: 'Deep Breathing', val: 45 },
            ].map((r, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-700">{r.label}</span>
                  <span className="text-emerald-600">+{r.val}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${r.val}%` }}
                    className="h-full bg-blue-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 italic leading-relaxed">
              "Focus Blocks" are your optimal recovery protocol for cognitive fatigue this week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoalsPage = ({ settings }: { settings: Settings | null }) => {
  if (!settings) return null;
  return (
    <div className="space-y-10">
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute right-[-20px] top-[-20px] w-1/3 h-[120%] opacity-5 pointer-events-none transition-transform group-hover:scale-105 duration-700">
          <Target className="text-blue-600 rotate-12" size={300} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-4">
              <TrendingUp size={14} /> Weekly Performance
            </div>
            <h2 className="text-3xl font-extrabold mb-3 tracking-tight">Stability improved by 12% this week</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Your cognitive baseline is stabilizing. You are regaining control over context switching, and your deep work endurance has increased by an average of <span className="text-blue-600 font-bold">18 minutes</span> per session.
            </p>
          </div>
          <div className="shrink-0">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
              View Detailed Report
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Target className="text-blue-600" size={20} />
                Focus Recovery Goals
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200">Behavior Design Layer</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-600/30 transition-colors shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-lg">Daily Focus Target</p>
                    <p className="text-xs text-slate-500">Target hours of deep work</p>
                  </div>
                  <Clock className="text-slate-300" size={20} />
                </div>
                <div className="mt-8 mb-2">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-black">{settings.daily_focus_target} <span className="text-sm font-normal text-slate-500">hrs</span></span>
                    <span className="text-xs font-bold text-blue-600">+20% vs avg</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-600/30 transition-colors shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-lg">Max Tab Switches</p>
                    <p className="text-xs text-slate-500">Threshold for context switching</p>
                  </div>
                  <LayoutDashboard className="text-slate-300" size={20} />
                </div>
                <div className="mt-8 mb-2">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-black">{settings.max_tab_switches} <span className="text-sm font-normal text-slate-500">switches</span></span>
                    <span className="text-xs font-bold text-blue-600">Low friction</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-600/30 transition-colors shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-lg">Digital Sunset</p>
                    <p className="text-xs text-slate-500">Auto-cutoff for all screens</p>
                  </div>
                  <Moon className="text-slate-300" size={20} />
                </div>
                <div className="flex items-center gap-4 mt-8">
                  <div className="bg-slate-50 border-none rounded-xl font-bold text-lg px-4 py-3 flex-1">
                    {settings.digital_sunset}
                  </div>
                  <button className="w-12 h-12 flex items-center justify-center bg-blue-600/10 text-blue-600 rounded-xl">
                    <Bell size={20} />
                  </button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-600/30 transition-colors shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-lg">Alert Sensitivity</p>
                    <p className="text-xs text-slate-500">Recovery nudge frequency</p>
                  </div>
                  <Bell size={20} className="text-slate-300" />
                </div>
                <div className="flex gap-2 mt-8">
                  {['Quiet', 'Balanced', 'Active'].map(s => (
                    <button key={s} className={`flex-1 py-3 text-[10px] font-bold rounded-xl border transition-colors uppercase tracking-wider ${settings.alert_sensitivity === s ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 hover:bg-slate-50'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold flex items-center gap-2">
                  <Zap className="text-orange-500" size={20} />
                  Recovery Streak
                </h4>
                <p className="text-xs text-slate-500"><span className="font-bold text-slate-900">8 days</span> above 75 score</p>
              </div>
              <div className="flex justify-between items-center gap-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${i < 4 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{day}</div>
                    {i < 4 ? <CheckCircle2 className="text-blue-600" size={14} /> : <div className="size-[14px] rounded-full border border-slate-200" />}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-2xl border border-slate-200 sticky top-24 shadow-sm">
            <h3 className="text-xl font-bold mb-8">Daily Standing</h3>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-slate-600">Deep Work</span>
                <span className="text-sm font-bold">3.2 / 4.0 hrs</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                <Info size={12} />
                48 mins remaining to hit daily goal
              </p>
            </div>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-slate-600">Context Switches</span>
                <span className="text-sm font-bold text-blue-600">6 / 15 limit</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600/40 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                <CheckCircle2 size={12} />
                Highly stable behavior today
              </p>
            </div>
            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-slate-600">Attention Score</span>
                <span className="text-sm font-bold">88 / 100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full shadow-[0_0_8px_rgba(25,127,230,0.3)]" style={{ width: '88%' }}></div>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Focus Insights</p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Lightbulb className="text-blue-600 bg-blue-600/10 rounded-lg p-1.5 h-fit" size={32} />
                  <p className="text-xs text-slate-600 leading-normal">
                    Your attention peaks between <span className="text-slate-900 font-semibold">9 AM and 11 AM</span>. Schedule deep work here.
                  </p>
                </li>
              </ul>
            </div>
            <button className="w-full mt-8 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl transition-all hover:bg-slate-800 active:scale-95">
              Download Weekly Summary
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ stats }: { stats: Stats | null }) => {
  if (!stats) return null;

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (stats.focus_score / 100) * circumference;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-10">
          <div className="relative flex-shrink-0">
            <svg className="w-48 h-48" viewBox="0 0 192 192">
              <circle
                cx="96" cy="96" r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-100"
              />
              <motion.circle
                cx="96" cy="96" r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-blue-600"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  strokeDasharray: circumference,
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'center',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-slate-900">{stats.focus_score}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Safe</span>
            </div>
          </div>
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 uppercase tracking-wider">
              <Shield size={14} /> Stable Focus
            </div>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">Your current focus score is {stats.focus_score}.</h2>
            <p className="text-slate-500 max-w-md">Focus is currently stable, but high tab switching behavior was noted in the last hour. Consider closing inactive browser windows.</p>
            <div className="pt-2">
              <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 mx-auto md:mx-0">
                View Detailed Analysis
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Recovery</p>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-green-600">+{stats.score_improvement}</span>
              <span className="text-sm font-medium text-slate-500">Score Improvement</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">Boosted focus after your last 2-minute deep breathing intervention at 2:15 PM.</p>
          </div>
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Recovery Milestone</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Day 4 Streak Achieved</p>
            </div>
          </div>
        </div>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Active Time', value: stats.active_time, icon: Clock, color: 'blue' },
          { label: 'Idle Time', value: stats.idle_time, icon: Moon, color: 'amber' },
          { label: 'Tab Switches', value: stats.tab_switches, icon: LayoutDashboard, color: 'purple' },
          { label: 'Session', value: stats.session_duration, icon: Target, color: 'green' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-blue-600 group-hover:text-white transition-colors`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-none">7-Day Burnout Trend</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">Focus health vs time</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-blue-600">Avg: 74</p>
              <p className="text-[10px] font-bold text-green-500 tracking-tighter uppercase">+5% improvement</p>
            </div>
          </div>
          <div className="h-48 w-full bg-slate-50 rounded-xl flex items-end justify-between px-4 pb-2">
            {/* Mock Chart Bars */}
            {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="w-8 bg-blue-600/20 rounded-t-lg relative group">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="w-full bg-blue-600 rounded-t-lg"
                />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-none">Peak Distraction</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">Intensity per hour today</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-amber-500">Peak: {stats.distraction_peak}</p>
              <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">12% decrease</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { time: '09:00', val: 20 },
              { time: '11:00', val: 45 },
              { time: '14:00', val: 90 },
              { time: '16:00', val: 15 },
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-slate-400 w-10">{d.time}</span>
                <div className="h-3 flex-1 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.val}%` }}
                    className={`h-full rounded-full ${d.val > 80 ? 'bg-blue-600' : 'bg-blue-600/40'}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
            <Lightbulb className="text-amber-500" size={20} />
            <p className="text-xs text-amber-800 font-medium">Distractions spiked at 2 PM. Try scheduling deep work before midday tomorrow.</p>
          </div>
        </div>
      </div>


      {/* Quick Reset */}
      <div className="bg-blue-600/5 border-2 border-dashed border-blue-600/20 rounded-2xl p-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:justify-between">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-extrabold text-slate-900">Need a quick reset?</h3>
            <p className="text-slate-500 mt-1">A 2-minute break can improve your focus score by up to 15%.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="px-5 py-2.5 bg-white border border-slate-200 hover:border-blue-600 text-slate-900 font-bold rounded-xl transition-all shadow-sm flex items-center gap-2">
              <Wind className="text-blue-600" size={18} />
              Start Breathing
            </button>
            <button className="px-5 py-2.5 bg-white border border-slate-200 hover:border-blue-600 text-slate-900 font-bold rounded-xl transition-all shadow-sm flex items-center gap-2">
              <Dumbbell className="text-blue-600" size={18} />
              Stretch
            </button>
            <button className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
              <Ban size={18} />
              Focus Block
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

const HistoryPage = ({ activities, events }: { activities: Activity[], events: EventLog[] }) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span className="font-medium">History</span>
            <ArrowRight size={14} />
            <span className="text-slate-900 font-bold">Behavior Timeline</span>
          </nav>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Today's Performance</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-white px-4 py-2 text-sm font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">Export Logs</button>
          <button className="bg-blue-600 text-white px-4 py-2 text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-transform">Live Tracking</button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="relative pl-12 before:content-[''] before:absolute before:left-5 before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-200 space-y-10">
            {activities.map((activity) => (
              <div key={activity.id} className="relative">
                <div className={`absolute -left-[32px] top-4 size-10 rounded-full bg-white border-4 z-10 flex items-center justify-center shadow-sm ${activity.type === 'FOCUS_BLOCK' ? 'border-green-500 text-green-500' :
                  activity.type === 'HIGH_DISTRACTION' ? 'border-amber-500 text-amber-500' : 'border-blue-500 text-blue-500'
                  }`}>
                  {activity.type === 'FOCUS_BLOCK' ? <Brain size={20} /> :
                    activity.type === 'HIGH_DISTRACTION' ? <AlertTriangle size={20} /> : <Moon size={20} />}
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-extrabold px-2 py-1 rounded shadow-sm uppercase tracking-wider ${activity.type === 'FOCUS_BLOCK' ? 'text-green-600 bg-green-50' :
                      activity.type === 'HIGH_DISTRACTION' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'
                      }`}>
                      {activity.type.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-bold text-slate-400">
                      {new Date(activity.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                      {new Date(activity.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">{activity.title}</h4>
                  <p className="text-slate-600 text-sm mb-4">{activity.description}</p>
                  {activity.score_impact !== 0 && (
                    <div className={`flex items-center gap-2 text-sm font-bold ${activity.score_impact > 0 ? 'text-green-600' : 'text-amber-600'}`}>
                      {activity.score_impact > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {activity.score_impact > 0 ? '+' : ''}{activity.score_impact} Focus Score
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="w-full lg:w-96 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col h-fit sticky top-24 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2 text-slate-900">
                <Terminal size={18} className="text-blue-600" />
                Advanced Event Logs
              </h3>
              <span className="bg-slate-100 text-[10px] font-bold px-1.5 py-0.5 rounded text-slate-500">LIVE</span>
            </div>
            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto font-mono text-[11px]">
              {events.map((event) => (
                <div key={event.id} className="flex gap-3 pb-3 border-b border-slate-50">
                  <span className="text-slate-400 shrink-0">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <div>
                    <p className={`font-bold ${event.event_type.includes('SPIKE') || event.event_type.includes('ATTEMPT') ? 'text-amber-600' :
                      event.event_type.includes('ACHIEVED') ? 'text-green-600' : 'text-blue-600'
                      }`}>{event.event_type}</p>
                    <p className="text-slate-500 mt-1">{event.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full p-4 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors border-t border-slate-100 flex items-center justify-center gap-2">
              EXPORT_RAW_JSON
              <Download size={14} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const SettingsPage = ({ settings, onSave }: { settings: Settings | null, onSave: (s: Settings) => void }) => {
  const [localSettings, setLocalSettings] = useState<Settings | null>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);
// Import types
import { Settings, Activity, EventLog, Stats } from './types';

// Import components
import { Header } from './components/Header';
import { Footer } from './components/Footer';

  const update = (key: keyof Settings, val: any) => {
    setLocalSettings({ ...localSettings, [key]: val });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-64 shrink-0">
        <div className="flex flex-col gap-1 sticky top-24">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-4 mb-3">Preferences</h3>
          <SidebarItem icon={User} label="Profile Settings" active={true} onClick={() => { }} />
          <SidebarItem icon={Bell} label="Notifications" active={false} onClick={() => { }} />
          <SidebarItem icon={Target} label="Focus Rules" active={false} onClick={() => { }} />
          <SidebarItem icon={Bolt} label="Integrations" active={false} onClick={() => { }} />
          <SidebarItem icon={Shield} label="Account Security" active={false} onClick={() => { }} />

          <div className="mt-8 px-4 py-4 bg-blue-600/10 rounded-2xl border border-blue-600/20">
            <p className="text-xs font-bold text-blue-600 uppercase mb-1">Current Plan</p>
            <p className="text-sm font-bold">Premium Annual</p>
            <p className="text-xs text-slate-500 mt-1">Renewal: Oct 2024</p>
            <button className="mt-3 text-xs font-bold text-blue-600 underline">Manage Subscription</button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col gap-8">
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-xl">
                <img src="https://picsum.photos/seed/alex/200" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full shadow-lg text-white border-4 border-white hover:scale-110 transition-transform">
                <Bolt size={16} />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black tracking-tight">{localSettings.full_name}</h2>
              <p className="text-slate-500 font-medium">{localSettings.email}</p>
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-slate-100 text-xs font-bold rounded-full text-slate-600">Premium User</span>
                <span className="px-3 py-1 bg-blue-600/10 text-xs font-bold rounded-full text-blue-600">Active Recovery</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <input
                type="text"
                value={localSettings.full_name}
                onChange={(e) => update('full_name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <input
                type="email"
                value={localSettings.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Professional Role</label>
              <input
                type="text"
                value={localSettings.role}
                onChange={(e) => update('role', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
              <p className="text-xs text-slate-400 ml-1">This helps us tailor focus intervals to your specific work type.</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="text-blue-600" size={32} />
            <div>
              <h3 className="text-xl font-black">Focus Rules</h3>
              <p className="text-sm text-slate-500">Configure how the system protects your attention.</p>
            </div>
          </div>
          <div className="space-y-6">
            {[
              { key: 'auto_trigger_breathing', label: 'Auto-trigger Breathing', desc: 'Initiate guided sessions based on high heart rate or strain.', icon: Wind },
              { key: 'block_notifications', label: 'Block Notifications', desc: 'Silence all OS-level notifications during Deep Focus sessions.', icon: Bell },
              { key: 'smart_breaks', label: 'Smart Breaks', desc: 'Automatically remind you to stand up every 45 minutes.', icon: Clock },
            ].map((rule) => (
              <div key={rule.key} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-600/30 hover:bg-blue-600/5 transition-all">
                <div className="flex gap-4">
                  <div className="bg-slate-100 p-3 rounded-lg flex items-center justify-center text-slate-600">
                    <rule.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">{rule.label}</h4>
                    <p className="text-sm text-slate-500">{rule.desc}</p>
                  </div>
                </div>
                <Toggle
                  checked={!!(localSettings as any)[rule.key]}
                  onChange={(val) => update(rule.key as any, val ? 1 : 0)}
                />
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-4">
            <Info className="text-blue-600" size={20} />
            <p className="text-sm font-medium opacity-80">Last synced: 2 minutes ago</p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2.5 rounded-xl border border-slate-700 font-bold hover:bg-slate-800 transition-colors">Discard</button>
            <button
              onClick={() => onSave(localSettings)}
              className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-black hover:scale-105 transition-transform"
            >
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// Import pages
import { Dashboard } from './pages/Dashboard';
import { HistoryPage } from './pages/HistoryPage';
import { InsightsPage } from './pages/InsightsPage';
import { GoalsPage } from './pages/GoalsPage';
import { SettingsPage } from './pages/SettingsPage';

// Type declarations for Chrome extension API
declare const chrome: any;

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [settings, setSettings] = useState<Settings | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [events, setEvents] = useState<EventLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode && JSON.parse(savedDarkMode)) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Check if we're in extension popup context (small width)
  const isExtensionPopup = typeof window !== 'undefined' && window.innerWidth <= 500;
  
  // Function to open full dashboard
  const openFullDashboard = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
      // Extension context - open options page
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    } else {
      // Web context - open in new window
      window.open(window.location.href, '_blank', 'width=1200,height=800');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from chrome.storage instead of API
        const [settingsData, activitiesData, eventsData, statsData] = await Promise.all([
          storageService.getSettings(),
          storageService.getActivities(),
          storageService.getEvents(),
          storageService.getStats()
        ]);
        
        if (settingsData) setSettings(settingsData);
        setActivities(activitiesData);
        setEvents(eventsData);
        if (statsData) setStats(statsData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    // Listen for storage changes
    storageService.addChangeListener((changes) => {
      if (changes.settings) {
        setSettings(changes.settings.newValue);
      }
      if (changes.activities) {
        setActivities(changes.activities.newValue || []);
      }
      if (changes.events) {
        setEvents(changes.events.newValue || []);
      }
      if (changes.stats) {
        setStats(changes.stats.newValue);
      }
    });
  }, []);

  const handleSaveSettings = async (newSettings: Settings) => {
    try {
      await storageService.updateSettings(newSettings);
      setSettings(newSettings);
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Failed to save settings", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-bold animate-pulse">Initializing Focus Recovery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <Bolt size={24} />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight leading-none">Focus Recovery</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Biometric Engine Active</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-2">
              <NavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
              <NavItem icon={History} label="History" active={activeTab === 'History'} onClick={() => setActiveTab('History')} />
              <NavItem icon={Lightbulb} label="Insights" active={activeTab === 'Insights'} onClick={() => setActiveTab('Insights')} />
              <NavItem icon={ActivityIcon} label="Fatigue CV" active={activeTab === 'FatigueTracker'} onClick={() => setActiveTab('FatigueTracker')} />
              <NavItem icon={Target} label="Goals" active={activeTab === 'Goals'} onClick={() => setActiveTab('Goals')} />
              <NavItem icon={SettingsIcon} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 rounded-full border border-blue-600/20">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs font-bold text-blue-600 tracking-wide uppercase">Score: {stats?.focus_score}</span>
            </div>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell size={20} />
            </button>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-slate-100">
              <img src="https://picsum.photos/seed/user/100" alt="Profile" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </header>
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col font-sans transition-colors">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} isExtensionPopup={isExtensionPopup} openFullDashboard={openFullDashboard} />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'Dashboard' && <Dashboard stats={stats} />}
            {activeTab === 'History' && <HistoryPage activities={activities} events={events} stats={stats} />}
            {activeTab === 'Settings' && <SettingsPage settings={settings} onSave={handleSaveSettings} />}
            {activeTab === 'Insights' && <InsightsPage stats={stats} />}
            {activeTab === 'FatigueTracker' && <FatigueTracker />}
            {activeTab === 'Goals' && <GoalsPage settings={settings} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
