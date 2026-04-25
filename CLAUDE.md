# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Global Study** — адаптивный веб-сайт на основе Telegram-канала [@Globalstudyy](https://t.me/Globalstudyy), ориентированный на студентов (18–30 лет). Весь интерфейс строго на русском языке.

## Key Constraints

- **Язык UI**: только русский — никакого английского в пользовательском интерфейсе
- **Telegram-канал**: https://t.me/Globalstudyy (источник контента)
- **Аудитория**: студенты 18–30 лет
- **Mobile-first**: адаптивность обязательна

## Architecture (planned)

Стек и структура будут определены в процессе проектирования. Спецификации хранятся в `docs/superpowers/specs/`.

## Content Sections

- Главная (лента последних постов + hero-блок)
- Новости
- Образование
- Возможности (стажировки, работа)
- Полезные ресурсы

## Telegram Integration

Контент канала подтягивается через Telegram Bot API либо имитируется через статический JSON. Кнопка «Подписаться на канал» обязательна на всех страницах.
