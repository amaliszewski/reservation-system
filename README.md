# 📦 Reservation Task App

Aplikacja do przetwarzania rezerwacji z plików Excel `.xlsx` i zapisywania ich do bazy MongoDB.

---

## 🧰 Technologie

- NestJS (backend)
- MongoDB + Mongoose
- Redis + BullMQ (kolejki)
- ExcelJS (parsowanie plików)
- class-validator + class-transformer (walidacja)
- React + Tailwind (frontend)

---

## 🚀 Uruchomienie (Docker Compose)

```bash
git clone <repo-url>
docker-compose up --build
```

Backend uruchamia się na `http://localhost:3000`.

---

## 📄 API

### POST `/tasks/upload`

Upload pliku `.xlsx` przez `multipart/form-data`.

- **Body**: `file` (plik Excel)

### GET `/tasks/status/:taskId`

Sprawdzenie statusu przetwarzania zadania.

### GET `/tasks/report/:taskId`

Pobranie raportu błędów (format JSON).

### POST `/auth/login`

Logowanie uytkownika do uzyskania acces tokena (testowy uytkownik jest tworzony podczas uruchamiania aplikacji).
Username: admin
Password: password

## 🧪 Testy

Testy backendu uruchomisz poleceniem:

```bash
npm run test
```

## 🧪 Dodatki

Został zrobiony UI do wysyłania plików oraz podglądu zadań z kolejki wraz z aktualizacją za pomocą websocketów.

Frontend uruchamia się na `http://localhost:5173`.

Dane do logowania:
Username: admin
Password: password
