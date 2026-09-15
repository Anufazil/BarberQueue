# API contracts and frontend actions

All paths have `/api` prefix. Staff authorization uses `Authorization: Bearer <JWT>`. Success envelope is preserved per original API: auth returns `user`/`token`, barber CRUD returns `barber`/`barbers`, aggregate and queue APIs return `data`. Errors return `{success:false,message}`.

| Method | Endpoint | Access | Frontend caller | Backend route | Controller/service | Models |
|---|---|---|---|---|---|---|
| POST | `/auth/login` | Public | LoginPage → useLogin → authApi.loginUser | authRoutes.js | authController.login | User |
| POST | `/auth/register-admin` | ADMIN | authApi.registerAdmin (no public registration page) | authRoutes.js | authController.registerAdmin | User |
| GET | `/auth/me` | Authenticated | AuthContext → api.get | authRoutes.js | authController.getMe | User + Barber account check |
| GET | `/users/profile` | Authenticated | External/legacy API | userRoutes.js | userController.getProfile | User |
| GET | `/users/admin` | ADMIN | External/legacy API | userRoutes.js | inline role check | User |
| GET | `/users/barber` | BARBER | External/legacy API | userRoutes.js | inline role check | User |
| GET | `/admin/dashboard` | ADMIN | AdminDashboard → useDashboard → adminApi.getDashboardStats | adminRoutes.js | adminController.getDashboard → adminService.getDashboard | User, Barber, Queue |
| GET | `/admin/statistics` | ADMIN | ReportsPage → api.get | adminRoutes.js | adminController.getStatistics → adminService.getStatistics | Barber, Queue |
| POST | `/barbers` | ADMIN | AddBarberModal → BarberForm → useCreateBarber → barberApi.createBarber | barberRoutes.js | barberController.createBarber → transaction | User, Barber |
| GET | `/barbers` | ADMIN | BarberManagement/QueueManagement → useBarbers → barberApi.getBarbers | barberRoutes.js | barberController.getAllBarbers | Barber, User |
| GET | `/barbers/dashboard` | BARBER | BarberDashboard → useBarberDashboard → barberApi.getBarberDashboard | barberRoutes.js | barberController.getBarberDashboard → barberService.getDashboard | Barber, User, Queue |
| GET | `/barbers/{id}` | ADMIN or owning BARBER | External API; admin detail UI obtains equivalent profile through queue API | barberRoutes.js | barberController.getBarberById | Barber, User |
| PUT | `/barbers/{id}` | ADMIN | EditBarberModal → BarberForm → useUpdateBarber → barberApi.updateBarber | barberRoutes.js | barberController.updateBarber → withBarber | Barber, Queue |
| DELETE | `/barbers/{id}` | ADMIN | DeleteBarberModal → useDeleteBarber → barberApi.deleteBarber | barberRoutes.js | barberController.deleteBarber → withBarber (deactivation) | Barber, Queue |
| PATCH | `/barbers/{id}/status` | ADMIN or owning BARBER | BarberTable / BarberStatusControl → status hooks → barberApi | barberRoutes.js | barberController.updateStatus → withBarber | Barber, Queue |
| GET | `/customer/home` | Public | CustomerDashboard/BarbersPage → useCustomerHome → customerApi.getCustomerHome | customerRoutes.js | customerController.getCustomerHome → customerService.getCustomerHome | Barber, Queue |
| POST | `/queue/join` | Public, limited | JoinQueueModal → useJoinQueue → customerApi.joinQueue | queueRoutes.js | queueController.joinQueue → queueService.joinQueue → withBarber | Barber, Queue |
| GET | `/queue/{barberId}` | ADMIN or owning BARBER | QueueManagement → api.get | queueRoutes.js | queueController.getQueueByBarber → queueService.getQueueByBarber | Barber, User, Queue |
| GET | `/queue/{barberId}/summary` | ADMIN or owning BARBER | External API; barber dashboard embeds own summary | queueRoutes.js | queueController.getQueueSummary → queueService.getQueueSummary | Barber, Queue |
| GET | `/queue/{barberId}/analytics` | ADMIN or owning BARBER | QueueManagement → api.get | queueRoutes.js | queueController.getQueueAnalytics → queueService.getQueueAnalytics | Barber, Queue |
| GET | `/queue/status/{token}` | Private 64-hex bearer capability | QueueStatusPage → useQueueStatus → customerApi.getQueueStatus; JoinQueueModal checks existing receipt | queueRoutes.js | queueController.getQueueStatus → queueService.getQueueStatus | Queue, Barber |
| PATCH | `/queue/public/cancel` | Private token in body; WAITING only | QueueStatusPage → useCancelQueue → customerApi.cancelQueue | queueRoutes.js | inline controller → queueService.cancelPublicQueue → withBarber | Queue, Barber |
| PATCH | `/queue/{barberId}/next` | ADMIN or owning BARBER | CurrentCustomerCard → useCallNextCustomer → queueApi.callNextCustomer | queueRoutes.js | queueController.callNextCustomer → queueService.callNextCustomer → withBarber | Queue, Barber |
| PATCH | `/queue/{barberId}/finish` | ADMIN or owning BARBER; queueId required | CurrentCustomerCard → useFinishCurrentCustomer → queueApi.finishCurrentCustomer | queueRoutes.js | queueController.finishCurrentCustomer → queueService.finishCurrentCustomer → withBarber | Queue, Barber |
| PATCH | `/queue/skip/{id}` | ADMIN or owning BARBER | CurrentCustomerCard → useSkipCustomer → queueApi.skipCustomer | queueRoutes.js | queueController.skipCustomer → queueService.skipCustomer → staffTransition → withBarber | Queue, Barber |
| PATCH | `/queue/cancel/{id}` | ADMIN or owning BARBER | WaitingQueueTable → useCancelCustomer → queueApi.cancelCustomer | queueRoutes.js | queueController.cancelQueue → queueService.cancelQueue → staffTransition → withBarber | Queue, Barber |

## Request bodies

- Login: email, password. Admin creation: name, email, password (existing ADMIN required).
- Create barber: name, email, password (8+ characters / at most 72 UTF-8 bytes), displayName, positive integer chairNumber; optional phone (empty or 10 digits), experience (nonnegative integer), specialization.
- Edit barber: displayName, chairNumber, phone, experience, specialization, isActive; user login identity is retained.
- Status: status = AVAILABLE/BUSY/BREAK/OFFLINE. Active service requires BUSY.
- Join: barberId, customerName (2–50 characters), phone (10 digits).
- Customer cancel: {accessToken}; only a waiting entry can be self-cancelled.
- Finish: {queueId}; required to prevent stale requests from completing a different customer.
- Next, skip and staff cancel: no body required.

## Deliberate compatibility changes

Numeric queue display tokens no longer authorize lookup. The join receipt includes a random accessToken used by /status/{token}; only its SHA-256 hash is stored. The display number remains numeric and scoped to a barber. Legacy numeric links cannot be recovered securely and are retired.
DELETE /barbers/{id} deactivates after the queue is cleared, preserving all relationships. PUT can reactivate. Staff cancellation still uses the original protected route. Public cancellation uses a separate private-capability route. Finish now requires queueId.

## Cache and feedback

Mutations display success/error toasts and invalidate their own data plus affected admin/customer views. Non-idempotent mutations are never automatically retried. Staff sockets invalidate canonical query keys, with 15-second polling fallback; public discovery polls every 15 seconds, customer status every 10 seconds. Existing terminal queue receipts are cleared on status view, and joining checks whether a stored receipt is still active.
