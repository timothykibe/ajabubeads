--
-- PostgreSQL database dump
--

\restrict EBCE0JArLpDCue2dvcsgTq1X2kaYmMBr0q0AGUXFyfg1PoaG696dmZ4GAJG0tg6

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpp1dxjw000083s1v0tclm8n', 'admin@ajabubeads.com', 'Admin User', '$2a$10$7/jhFuahuHiTWQLP6wUgxuRGbYruVV07LDHwBC49uE5mlRUuadXzG', '+254 712 345 678', NULL, NULL, NULL, NULL, 'Kenya', true, true, true, '2026-05-28 05:12:32.538', '2026-05-28 05:12:32.538', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpqr4x9a000cr2gb8xa1zsxa', 'greenlightkibe@gmail.com', 'Timothy', '$2a$10$Csv5x9pwGWgr21axBEIDi.INrqwaHjkFQrOFVSfaFiZrk/55bSCku', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 10:01:08.443', '2026-05-29 10:01:08.443', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr173pp00009yt9hox9lgez', 'demo+1@ajabubeads.com', 'Demo User 1', '$2a$10$SCBonEzw9TLzCQ/tqIaqx.oGj3Qmxi1q0piHSQewNwIDuHVkVdfOW', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:46.285', '2026-05-29 14:42:46.285', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr173t400019yt9ljjl62i2', 'demo+2@ajabubeads.com', 'Demo User 2', '$2a$10$SwW22KX0jZLjX9P7jd98iOCDJ7xcCih2yPGcagD4qeOwIfJSXehY2', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:46.409', '2026-05-29 14:42:46.409', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr173vh00029yt9fgivk9ko', 'demo+3@ajabubeads.com', 'Demo User 3', '$2a$10$8Nh4EahK1bkvqc1nY5eEXOy0DL44NFt9VvWbsC2d55M3u8OSKHmJq', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:46.493', '2026-05-29 14:42:46.493', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr173xy00039yt9uuyi9ohn', 'demo+4@ajabubeads.com', 'Demo User 4', '$2a$10$xSIIn7eeBcxqb5oBL2lJDuGDFxsZFLBZm4ECqfkRXyKnn.Sxq5bU.', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:46.582', '2026-05-29 14:42:46.582', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr1740d00049yt9iny56gn5', 'demo+5@ajabubeads.com', 'Demo User 5', '$2a$10$FGOI2JCdt4oy8vvi8YTZveY1qr1dDb/1kyWP4qaG6GHExfwxTq4Qi', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:46.669', '2026-05-29 14:42:46.669', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr1742t00059yt9b2nrh69o', 'demo+6@ajabubeads.com', 'Demo User 6', '$2a$10$0.XI8iXHeqq.B63oVjooJ.gxbZr0fx28Sp3qC.VLniEOHowe.9B5G', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:46.757', '2026-05-29 14:42:46.757', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr1745800069yt9m7n7zvce', 'demo+7@ajabubeads.com', 'Demo User 7', '$2a$10$v/pzQrTgrtg97noIag293uIo3zYBkCjw6EqtVP2ItfbpTEzjOis1m', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:46.844', '2026-05-29 14:42:46.844', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr1747v00079yt9c5qgvprn', 'demo+8@ajabubeads.com', 'Demo User 8', '$2a$10$XN.jWjDRrhz3ppreHNuclObFkIDP1PXptsUmvTqreHUnQOLCbupPy', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:46.939', '2026-05-29 14:42:46.939', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr174a700089yt98osoa7df', 'demo+9@ajabubeads.com', 'Demo User 9', '$2a$10$KT07Kh1Kx33/4CrWfhuhCekTS5C4you7HMyJGFWZehh7KFJpdmX1C', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:47.024', '2026-05-29 14:42:47.024', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr174cl00099yt9suf6jje5', 'demo+10@ajabubeads.com', 'Demo User 10', '$2a$10$lMZq5x/3SZtuXePHnNOuXuoRcWuMJZYt4twNkqZsdBF3tw05U8ny.', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:47.109', '2026-05-29 14:42:47.109', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr174fa000a9yt9pg9ek785', 'demo+11@ajabubeads.com', 'Demo User 11', '$2a$10$13laoUbUD/rDrw4qkIwtHuaB/YmWhPcq6aulEEqpNYiB8aGmlk/.2', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:47.206', '2026-05-29 14:42:47.206', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr174hm000b9yt9udlu2msp', 'demo+12@ajabubeads.com', 'Demo User 12', '$2a$10$qSlA.auF.eQDWdjyEEcMhOi5gCh7TcOTo3J4Ax9AiVwdqPGsqEkwq', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:47.291', '2026-05-29 14:42:47.291', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr174jz000c9yt9tcv2fpke', 'demo+13@ajabubeads.com', 'Demo User 13', '$2a$10$wbhYb4XSHADIkUlbRHLFnur2fN2EgzjKcPNuww2I40VJRrjLD6/2i', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:47.375', '2026-05-29 14:42:47.375', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr174mh000d9yt9ox4x2urd', 'demo+14@ajabubeads.com', 'Demo User 14', '$2a$10$q.l3dJNJM6rCFr/KsZlqZe.AOxhouMYIN5WUpnwpIdIDWsEKXVR7G', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:47.466', '2026-05-29 14:42:47.466', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr174p0000e9yt9t3u773oo', 'demo+15@ajabubeads.com', 'Demo User 15', '$2a$10$TaAV18GN62W3QdJDPubt.ulI4AjjTJ4zDorDOEfzH8ib2NU5CEUZi', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:47.556', '2026-05-29 14:42:47.556', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr174re000f9yt9xaf9xh2u', 'demo+16@ajabubeads.com', 'Demo User 16', '$2a$10$7DiJ/SE70t6nfq3QB2qX9um2svyCs6ctpCfmQWzyVp4Bo586OlOfa', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:47.643', '2026-05-29 14:42:47.643', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr174tt000g9yt9qs8yyi2m', 'demo+17@ajabubeads.com', 'Demo User 17', '$2a$10$3t7ltH6lQJKR2Py4CEwLheifE3NQLGLm0L2E3.ArsL0GhTzNEoghu', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:47.73', '2026-05-29 14:42:47.73', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr174x3000h9yt9umql5qv2', 'demo+18@ajabubeads.com', 'Demo User 18', '$2a$10$7HMYS.vIawohRyF/Xj8tROBWqFDQ8/kNsDznfrfaxYwsBjEDHrLOe', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:47.848', '2026-05-29 14:42:47.848', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr1751x000i9yt9o23vwixw', 'demo+19@ajabubeads.com', 'Demo User 19', '$2a$10$AhFfMMN5F2XiNJ39R8pqVOxHkCcUkB8U4UiI7SfwGYdmFQPWfpCe.', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:48.021', '2026-05-29 14:42:48.021', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr1757a000j9yt9dvmgq4li', 'demo+20@ajabubeads.com', 'Demo User 20', '$2a$10$LDhRfYyUL3mZ5LIbw9GRdO8jpK.Lt2R7muHsknzTxqRJ4TIM7FVxW', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:48.215', '2026-05-29 14:42:48.215', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr175cy000k9yt96tjlxmwt', 'demo+21@ajabubeads.com', 'Demo User 21', '$2a$10$tTQsqdf61YfSGJ/mfFuYUeKrungyaUA4H0dtT3.Z.DDC/czVp2AWa', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:48.418', '2026-05-29 14:42:48.418', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr175hn000l9yt9lnzn583b', 'demo+22@ajabubeads.com', 'Demo User 22', '$2a$10$DAIN2zbKqXR2/cUISTJK6etcrKIqjb4FF8fV89V4Hyz98dJyq9JD6', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:48.588', '2026-05-29 14:42:48.588', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr175lb000m9yt9ddwumz5w', 'demo+23@ajabubeads.com', 'Demo User 23', '$2a$10$FP.EZfHwkOVR.xtdMrPt9uwYid906pgrcpDAfbza1h6iVmPmfjA8a', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:48.719', '2026-05-29 14:42:48.719', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr175p1000n9yt9b0btzbi4', 'demo+24@ajabubeads.com', 'Demo User 24', '$2a$10$WwN88Ew4YeUpkl5/ERsxW.BmeSZSQlEV8L/9kQxfMI4m8ExGehzx6', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:48.853', '2026-05-29 14:42:48.853', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr175sg000o9yt9ms37un3p', 'demo+25@ajabubeads.com', 'Demo User 25', '$2a$10$b86.Lm6zhJrlnwHQaqG84.owGZMEEblrB1UwM9JR2MguFcQcficea', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:48.977', '2026-05-29 14:42:48.977', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr175vz000p9yt97jw4od9g', 'demo+26@ajabubeads.com', 'Demo User 26', '$2a$10$t0./8040T.v14h2kAx.pjepHqSXNUJfa2mwaAY1wpK40z5uSgmLee', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:49.103', '2026-05-29 14:42:49.103', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr175zt000q9yt9yh6fn2u1', 'demo+27@ajabubeads.com', 'Demo User 27', '$2a$10$dTR.vwhEAbeTWE7s.F08y.UJNjfkO9XmVbQY.6iXqVzTRrfkT29c2', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:49.241', '2026-05-29 14:42:49.241', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr1763f000r9yt9yikphyps', 'demo+28@ajabubeads.com', 'Demo User 28', '$2a$10$fQuDYNF9145mF.2UDN41Tuf7JxgR33/stfyR6QzS4iad7kGSWOTbm', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:49.371', '2026-05-29 14:42:49.371', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr17675000s9yt9ys6df7hq', 'demo+29@ajabubeads.com', 'Demo User 29', '$2a$10$ZyJYT43cSYXv92NNQkYwEOvHrTCc5lSYOScKEDU44hUt0a6zGIx1m', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:49.505', '2026-05-29 14:42:49.505', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr176an000t9yt9q9lp8p36', 'demo+30@ajabubeads.com', 'Demo User 30', '$2a$10$6TJzJEkTSeZPG8YDIaqMEe1TW8R9ISavB90ZrgZsrUiJEwSjCJlXm', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:49.632', '2026-05-29 14:42:49.632', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr176dz000u9yt9x95sfeuc', 'demo+31@ajabubeads.com', 'Demo User 31', '$2a$10$eEKoa52dIW5YGuA/itxI/uECc2y8wADEPausbkiawzO/JFpTOnv8i', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:49.752', '2026-05-29 14:42:49.752', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr176id000v9yt9o1x68dnf', 'demo+32@ajabubeads.com', 'Demo User 32', '$2a$10$Nf7vxlYP92LGnIZjSK8TMupxJsXcKPROsBfFl00DLLRy0Ik1pqrj2', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:49.91', '2026-05-29 14:42:49.91', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr176n3000w9yt9ag69fz8l', 'demo+33@ajabubeads.com', 'Demo User 33', '$2a$10$Xa5j/O4wIWmCaSBRsDIKp..hQM0moc5NNI4sx8xN4YB7pecsoogku', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:50.08', '2026-05-29 14:42:50.08', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr176qz000x9yt9x34fk6zu', 'demo+34@ajabubeads.com', 'Demo User 34', '$2a$10$zownkZkmLuQffy6kVYjaUeNY6.T27u5.fswssr0vMSGzrJZNFcrZC', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:50.219', '2026-05-29 14:42:50.219', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr176ua000y9yt9jzfw22j1', 'demo+35@ajabubeads.com', 'Demo User 35', '$2a$10$mfJxvgAOM8G5tDQ7y8BmAeHhYIGP5IDRkNL.SCGy4ZRH7MTKgnJRi', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:50.339', '2026-05-29 14:42:50.339', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr176xq000z9yt9aef93hst', 'demo+36@ajabubeads.com', 'Demo User 36', '$2a$10$F2iIl/HcnB.XC/IPLucaAemqlS2XXGt1kI0FSlYITA8MLfxel9Mc.', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:50.463', '2026-05-29 14:42:50.463', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr1770z00109yt9dbzdahyu', 'demo+37@ajabubeads.com', 'Demo User 37', '$2a$10$z7m3yGpOT8dkw6kpne9aOOJM2pjb.edAGjehz4LyKDRk8pNpb3SPO', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:50.579', '2026-05-29 14:42:50.579', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr1774200119yt9u43g7u5l', 'demo+38@ajabubeads.com', 'Demo User 38', '$2a$10$ySL6.15l7846Vtm743SyEO1vWrvc2h3oOubORdQDBtWpeNGplzWw6', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:50.69', '2026-05-29 14:42:50.69', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr1777a00129yt95iyp2bmw', 'demo+39@ajabubeads.com', 'Demo User 39', '$2a$10$lvFr6rOIPBFRGZ8F2VPrz.UFjTS9.wBS5dKZYWmbQPhlPeZ7E0QDS', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:50.807', '2026-05-29 14:42:50.807', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr177ba00139yt9ywgo9oz5', 'demo+40@ajabubeads.com', 'Demo User 40', '$2a$10$A4Q8QwvxEXakW9Z.bjrdFuKyXm62KjJDaRqoVQCScARdrlvphtPVe', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:50.951', '2026-05-29 14:42:50.951', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr177ek00149yt9j5m7os3g', 'demo+41@ajabubeads.com', 'Demo User 41', '$2a$10$euHouUtfXF9E94J4yw/4yekqVgrHZTyaDqREhCgBcfkIz0vW6QWla', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:51.068', '2026-05-29 14:42:51.068', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr177hr00159yt91ct2wfvi', 'demo+42@ajabubeads.com', 'Demo User 42', '$2a$10$ctdvvzTur1fjd8H2/xEneeM/2iC8Gud9qLjg9redLWWMcxw3hLW1G', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:51.183', '2026-05-29 14:42:51.183', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr177ks00169yt90rc4f62t', 'demo+43@ajabubeads.com', 'Demo User 43', '$2a$10$djFSVpd3uy2NDPqklhcUsODTaqQzFuHq2zLgataXAMfiTxTHu/U.2', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:51.292', '2026-05-29 14:42:51.292', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr177nt00179yt9gd8ch9lx', 'demo+44@ajabubeads.com', 'Demo User 44', '$2a$10$eGvN2fsg36SU2PdF.XDMNexsvFn9plsAdbdSxpNzVdAW7j9UsObcm', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:51.402', '2026-05-29 14:42:51.402', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr177r100189yt97bmntpbc', 'demo+45@ajabubeads.com', 'Demo User 45', '$2a$10$eNZV6rObLoQ8ta/zKYEN8u9TF.Xz.J0tDolggNL3U9SI5kdiBdgCW', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:51.517', '2026-05-29 14:42:51.517', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr177tv00199yt9g7lu254j', 'demo+46@ajabubeads.com', 'Demo User 46', '$2a$10$QmqD6FJ4Lb.Xsa.RB7xT2e/U2Apq9ydQHR2imYsinypMD7yTR102K', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:51.619', '2026-05-29 14:42:51.619', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr177ww001a9yt9x78tjnqo', 'demo+47@ajabubeads.com', 'Demo User 47', '$2a$10$JTsbLf1u91MzGQLbI1Gk1.lPUJTDEIFmkYFy1NsxMUHRRCicOjHNW', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:51.729', '2026-05-29 14:42:51.729', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr1780u001b9yt94lzmxd3d', 'demo+48@ajabubeads.com', 'Demo User 48', '$2a$10$Y4E8VdUmvDpwrg1OJxu0S.G4kGHtN/eOkEVLKAnb4/KUO9taeG.re', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:51.87', '2026-05-29 14:42:51.87', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr1785g001c9yt9e8ahh2o3', 'demo+49@ajabubeads.com', 'Demo User 49', '$2a$10$azqeCbx2t1kI4yLua2MEQ.3DLW6Ulm2P.QOkmaa0zbPoE7XRoOpe2', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:52.037', '2026-05-29 14:42:52.037', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmpr178ag001d9yt9nlvw6peh', 'demo+50@ajabubeads.com', 'Demo User 50', '$2a$10$0IDvqsu5qzfmj1m/US4oFedzTqXGSLO5NxlaSKNbKndrLkWuHk6uW', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 14:42:52.216', '2026-05-29 14:42:52.216', false);
INSERT INTO public."User" (id, email, name, password, phone, image, address, city, "postalCode", country, "isAdmin", "isSuperAdmin", "isActive", "createdAt", "updatedAt", "isSubscribed") VALUES ('cmprben5w0000fedzyvmg30il', 'test@ajabu.com', 'Timothy Kibe', '$2a$10$ThQGTZ/u3FjCK4l.iUNj7Oiu7tGc8auyiH8q9PI3x4Mk9pjQFRmyO', NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, '2026-05-29 19:28:34.243', '2026-05-29 19:28:34.243', false);


--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: AnalyticsEvent; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Blog; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Blog" (id, title, slug, excerpt, content, "featuredImage", author, tags, "isPublished", "metaTitle", "metaDescription", "metaKeywords", views, "createdAt", "updatedAt", "publishedAt") VALUES ('cmppiqx1n000c12cmdf8q128r', 'E2E Test Blog', 'e2e-test-blog', 'Testing blog create', '<p>Content</p>', NULL, 'Ajabu Beads', '{test}', true, 'E2E Test Blog', 'Testing blog create', NULL, 0, '2026-05-28 13:18:31.881', '2026-05-28 13:18:31.881', '2026-05-28 13:18:31.877');
INSERT INTO public."Blog" (id, title, slug, excerpt, content, "featuredImage", author, tags, "isPublished", "metaTitle", "metaDescription", "metaKeywords", views, "createdAt", "updatedAt", "publishedAt") VALUES ('cmpphyzjr000612cmkjavudqf', 'test blog', 'test-blog', 'the test', 'the content ', 'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=', 'Ajabu Beads', '{}', true, 'test blog', 'the test', '', 6, '2026-05-28 12:56:48.757', '2026-05-29 12:42:58.006', '2026-05-28 12:56:48.753');
INSERT INTO public."Blog" (id, title, slug, excerpt, content, "featuredImage", author, tags, "isPublished", "metaTitle", "metaDescription", "metaKeywords", views, "createdAt", "updatedAt", "publishedAt") VALUES ('cmprbz0rh0008fedz998d6req', 'The title', 'slug details', 'the exerpt', 'golb tset eht', '/uploads/1780083838043-ChatGPT_Image_May_27__2026__07_46_25_PM.png', 'Ajabu Beads', '{tags}', true, 'The title', 'the exerpt', NULL, 2, '2026-05-29 19:44:24.989', '2026-05-29 19:44:36.965', '2026-05-29 19:44:24.986');


--
-- Data for Name: Media; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Order" (id, "orderNumber", "userId", "guestToken", "firstName", "lastName", email, phone, address, city, "postalCode", country, subtotal, tax, shipping, total, status, "paymentStatus", "paymentMethod", "createdAt", "updatedAt") VALUES ('cmpp3g7gh0001h7nu9rxs25zh', 'ORD-1779948617917-HAIM5', NULL, 'guest-test-1779948617319', 'Guest', 'Tester', 'guest@example.com', '+254700000000', '123 Test Lane', 'Nairobi', '00100', 'Kenya', 1234, 197, 500, 1931, 'PENDING', 'PENDING', 'MPESA', '2026-05-28 06:10:17.921', '2026-05-28 06:10:17.921');
INSERT INTO public."Order" (id, "orderNumber", "userId", "guestToken", "firstName", "lastName", email, phone, address, city, "postalCode", country, subtotal, tax, shipping, total, status, "paymentStatus", "paymentMethod", "createdAt", "updatedAt") VALUES ('cmppcx9is0004h7nua9g0z167', 'ORD-1779964530286-6ETNZ', NULL, 'guest-test-endtoend', 'Test', 'User', 'test@example.com', '+254700000000', '1 Test Ave', 'Nairobi', '00100', 'Kenya', 1234, 197, 500, 1931, 'PENDING', 'PENDING', 'MPESA', '2026-05-28 10:35:30.292', '2026-05-28 10:35:30.292');
INSERT INTO public."Order" (id, "orderNumber", "userId", "guestToken", "firstName", "lastName", email, phone, address, city, "postalCode", country, subtotal, tax, shipping, total, status, "paymentStatus", "paymentMethod", "createdAt", "updatedAt") VALUES ('cmpphiu9y000012cmupkpxb8o', 'ORD-1779972255422-ZVTWR', NULL, 'guest-test-token-123', 'Guest', 'Tester', 'guest@example.com', '0712345678', '123 Test Street', 'Nairobi', '00100', 'Kenya', 1234, 197, 500, 1931, 'PENDING', 'PENDING', 'MPESA', '2026-05-28 12:44:15.43', '2026-05-28 12:44:15.43');
INSERT INTO public."Order" (id, "orderNumber", "userId", "guestToken", "firstName", "lastName", email, phone, address, city, "postalCode", country, subtotal, tax, shipping, total, status, "paymentStatus", "paymentMethod", "createdAt", "updatedAt") VALUES ('cmpphqi45000312cmohmhxags', 'ORD-1779972612911-45CF2', NULL, '7e630f19-7d1f-4f72-af7b-253d7a0c0915', 'Timothy', 'Kibe', 'greenlightkibe@gmail.com', '0726862144', '00100', 'Nairobi', '00100', 'Kenya', 1234, 197, 500, 1931, 'PENDING', 'PENDING', 'CYBERSOURCE', '2026-05-28 12:50:12.915', '2026-05-28 12:50:12.915');
INSERT INTO public."Order" (id, "orderNumber", "userId", "guestToken", "firstName", "lastName", email, phone, address, city, "postalCode", country, subtotal, tax, shipping, total, status, "paymentStatus", "paymentMethod", "createdAt", "updatedAt") VALUES ('cmppi4uw3000712cmbf4z363k', 'ORD-1779973282657-BSV5D', NULL, 'a806b828-52e6-4360-a66c-c8a9fc8b807e', 'Timothy', 'Kibe', 'greenlightkibe@gmail.com', '0726862144', '00100', 'Nairobi', '00100', 'Kenya', 4034, 645, 500, 5179, 'PENDING', 'PENDING', 'MPESA', '2026-05-28 13:01:22.659', '2026-05-28 13:01:22.659');
INSERT INTO public."Order" (id, "orderNumber", "userId", "guestToken", "firstName", "lastName", email, phone, address, city, "postalCode", country, subtotal, tax, shipping, total, status, "paymentStatus", "paymentMethod", "createdAt", "updatedAt") VALUES ('cmprbgdsm0001fedzx2h0vk9a', 'ORD-1780082995409-CJHGS', NULL, 'ad752706-2785-4a68-a88b-79e4ae1dc1e2', 'Timothy', 'Kibe', 'greenlightkibe@gmail.com', '072686214443', '00100', 'Nairobi', '00100', 'Kenya', 5600, 896, 0, 6496, 'PENDING', 'PENDING', 'MPESA', '2026-05-29 19:29:55.414', '2026-05-29 19:29:55.414');
INSERT INTO public."Order" (id, "orderNumber", "userId", "guestToken", "firstName", "lastName", email, phone, address, city, "postalCode", country, subtotal, tax, shipping, total, status, "paymentStatus", "paymentMethod", "createdAt", "updatedAt") VALUES ('cmprbm5jh0004fedzojhxsvdz', 'ORD-1780083264648-3YL6U', NULL, '18166bc7-217f-46c3-ad45-4823019f493f', 'Timothy', 'Kibe', 'greenlightkibe@gmail.com', '0726862144', '00100', 'Nairobi', '00100', 'Kenya', 5600, 896, 0, 6496, 'PENDING', 'PENDING', 'MPESA', '2026-05-29 19:34:24.653', '2026-05-29 19:34:24.653');


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Product" (id, name, description, price, "costPrice", sku, images, category, colors, sizes, stock, "lowStockAlert", rating, "reviewCount", "inStock", "isActive", "isFeatured", slug, "metaTitle", "metaDescription", "createdAt", "updatedAt") VALUES ('cmpp3ef0l0000h7nuk1w7160t', 'Dummy Test Product', 'Created by automated validation', 1234, NULL, 'DUMMY-1779948534347', '{/products/bracelet-1.jpg}', 'Bracelets', '{Test}', '{M}', 0, 10, 0, 0, true, true, false, 'dummy-test-product-1779948534347', 'Dummy Test Product', 'Test product created for validation', '2026-05-28 06:08:54.404', '2026-05-28 13:01:22.737');
INSERT INTO public."Product" (id, name, description, price, "costPrice", sku, images, category, colors, sizes, stock, "lowStockAlert", rating, "reviewCount", "inStock", "isActive", "isFeatured", slug, "metaTitle", "metaDescription", "createdAt", "updatedAt") VALUES ('cmpp1dxko000183s1q58i8fzk', 'Harmony Gold Beaded Bracelet', 'A stunning combination of gold and amber clay beads with traditional African patterns. Perfect for daily wear or special occasions.', 2800, 1200, 'BRACELET-001', '{/products/bracelet-1.jpg}', 'Bracelets', '{Gold,Amber}', '{M,L}', 20, 5, 5, 148, true, true, true, 'harmony-gold-beaded-bracelet', 'Harmony Gold Beaded Bracelet - Handcrafted African Jewelry', 'Stunning gold and amber clay beads bracelet with traditional African patterns. Shop now for authentic handcrafted jewelry.', '2026-05-28 05:12:32.568', '2026-05-29 19:34:24.775');
INSERT INTO public."Product" (id, name, description, price, "costPrice", sku, images, category, colors, sizes, stock, "lowStockAlert", rating, "reviewCount", "inStock", "isActive", "isFeatured", slug, "metaTitle", "metaDescription", "createdAt", "updatedAt") VALUES ('cmprbwgwz0007fedz084hwl21', 'Test product add', 'The description ', 2000, NULL, 'thr', '{/uploads/1780083675014-IMG_20250728_095017.jpg}', 'category', '{Blue,Gray}', '{}', 10000, 10, 0, 0, true, true, false, 'test-product-add', NULL, NULL, '2026-05-29 19:42:25.952', '2026-05-29 19:42:25.952');


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."OrderItem" (id, "orderId", "productId", quantity, price, color, size) VALUES ('cmpp3g7gh0002h7nutbfcqxkj', 'cmpp3g7gh0001h7nu9rxs25zh', 'cmpp3ef0l0000h7nuk1w7160t', 1, 1234, NULL, NULL);
INSERT INTO public."OrderItem" (id, "orderId", "productId", quantity, price, color, size) VALUES ('cmppcx9it0005h7nutn2y6rb1', 'cmppcx9is0004h7nua9g0z167', 'cmpp3ef0l0000h7nuk1w7160t', 1, 1234, NULL, NULL);
INSERT INTO public."OrderItem" (id, "orderId", "productId", quantity, price, color, size) VALUES ('cmpphiua1000112cmusd49h33', 'cmpphiu9y000012cmupkpxb8o', 'cmpp3ef0l0000h7nuk1w7160t', 1, 1234, NULL, NULL);
INSERT INTO public."OrderItem" (id, "orderId", "productId", quantity, price, color, size) VALUES ('cmpphqi46000412cmbnsde71d', 'cmpphqi45000312cmohmhxags', 'cmpp3ef0l0000h7nuk1w7160t', 1, 1234, NULL, NULL);
INSERT INTO public."OrderItem" (id, "orderId", "productId", quantity, price, color, size) VALUES ('cmppi4uw3000912cmehslo368', 'cmppi4uw3000712cmbf4z363k', 'cmpp1dxko000183s1q58i8fzk', 1, 2800, NULL, NULL);
INSERT INTO public."OrderItem" (id, "orderId", "productId", quantity, price, color, size) VALUES ('cmppi4uw3000812cm5hd2z6yw', 'cmppi4uw3000712cmbf4z363k', 'cmpp3ef0l0000h7nuk1w7160t', 1, 1234, NULL, NULL);
INSERT INTO public."OrderItem" (id, "orderId", "productId", quantity, price, color, size) VALUES ('cmprbgdso0002fedz5zysalyh', 'cmprbgdsm0001fedzx2h0vk9a', 'cmpp1dxko000183s1q58i8fzk', 2, 2800, 'Gold', 'L');
INSERT INTO public."OrderItem" (id, "orderId", "productId", quantity, price, color, size) VALUES ('cmprbm5jj0005fedz3ihvf3a2', 'cmprbm5jh0004fedzojhxsvdz', 'cmpp1dxko000183s1q58i8fzk', 2, 2800, 'Gold', 'L');


--
-- Data for Name: PageAnalytics; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Payment" (id, "orderId", method, amount, currency, "mpesaCode", "cybersourceTransactionId", status, "failureReason", metadata, "createdAt", "updatedAt") VALUES ('cmpp3g7jm0003h7numumki3s9', 'cmpp3g7gh0001h7nu9rxs25zh', 'MPESA', 1931, 'KES', NULL, NULL, 'PENDING', NULL, NULL, '2026-05-28 06:10:18.035', '2026-05-28 06:10:18.035');
INSERT INTO public."Payment" (id, "orderId", method, amount, currency, "mpesaCode", "cybersourceTransactionId", status, "failureReason", metadata, "createdAt", "updatedAt") VALUES ('cmppcx9ku0006h7nuh1z87wfo', 'cmppcx9is0004h7nua9g0z167', 'MPESA', 1931, 'KES', NULL, NULL, 'PENDING', NULL, NULL, '2026-05-28 10:35:30.367', '2026-05-28 10:35:30.367');
INSERT INTO public."Payment" (id, "orderId", method, amount, currency, "mpesaCode", "cybersourceTransactionId", status, "failureReason", metadata, "createdAt", "updatedAt") VALUES ('cmpphiucm000212cmpjdni07h', 'cmpphiu9y000012cmupkpxb8o', 'MPESA', 1931, 'KES', NULL, NULL, 'PENDING', NULL, NULL, '2026-05-28 12:44:15.526', '2026-05-28 12:44:15.526');
INSERT INTO public."Payment" (id, "orderId", method, amount, currency, "mpesaCode", "cybersourceTransactionId", status, "failureReason", metadata, "createdAt", "updatedAt") VALUES ('cmpphqi5s000512cmtfp0yizl', 'cmpphqi45000312cmohmhxags', 'CYBERSOURCE', 1931, 'KES', NULL, NULL, 'PENDING', NULL, NULL, '2026-05-28 12:50:12.977', '2026-05-28 12:50:12.977');
INSERT INTO public."Payment" (id, "orderId", method, amount, currency, "mpesaCode", "cybersourceTransactionId", status, "failureReason", metadata, "createdAt", "updatedAt") VALUES ('cmppi4uxo000a12cm7l06zvta', 'cmppi4uw3000712cmbf4z363k', 'MPESA', 5179, 'KES', NULL, NULL, 'PENDING', NULL, NULL, '2026-05-28 13:01:22.716', '2026-05-28 13:01:22.716');
INSERT INTO public."Payment" (id, "orderId", method, amount, currency, "mpesaCode", "cybersourceTransactionId", status, "failureReason", metadata, "createdAt", "updatedAt") VALUES ('cmprbgdvk0003fedzxedc40nw', 'cmprbgdsm0001fedzx2h0vk9a', 'MPESA', 6496, 'KES', NULL, NULL, 'PENDING', NULL, NULL, '2026-05-29 19:29:55.52', '2026-05-29 19:29:55.52');
INSERT INTO public."Payment" (id, "orderId", method, amount, currency, "mpesaCode", "cybersourceTransactionId", status, "failureReason", metadata, "createdAt", "updatedAt") VALUES ('cmprbm5m60006fedz1qour96b', 'cmprbm5jh0004fedzojhxsvdz', 'MPESA', 6496, 'KES', NULL, NULL, 'PENDING', NULL, NULL, '2026-05-29 19:34:24.75', '2026-05-29 19:34:24.75');


--
-- Data for Name: ProductAnalytics; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."ProductAnalytics" (id, "productId", views, clicks, purchases, revenue, date) VALUES ('cmppjk7kz0001r2gbb6xrrql0', 'cmpp3ef0l0000h7nuk1w7160t', 4, 0, 0, 0, '2026-05-27 21:00:00');
INSERT INTO public."ProductAnalytics" (id, "productId", views, clicks, purchases, revenue, date) VALUES ('cmpqh7gho0009r2gbba6ydeli', 'cmpp3ef0l0000h7nuk1w7160t', 2, 0, 0, 0, '2026-05-28 21:00:00');
INSERT INTO public."ProductAnalytics" (id, "productId", views, clicks, purchases, revenue, date) VALUES ('cmpqr56ak000er2gbi35rmz33', 'cmpp1dxko000183s1q58i8fzk', 8, 0, 0, 0, '2026-05-28 21:00:00');


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: SavedProduct; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('1ab53532-06d5-4ffc-886b-407001d3de10', '0cf46d2890982ee5e29cc01ec193c5dbe4b1556e133d7296b8060ca402a5050f', '2026-05-28 05:07:43.399336+00', '20260528050742_add_admin_roles', NULL, NULL, '2026-05-28 05:07:42.96182+00', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('67203599-a5a7-4c77-8956-6768dee0c206', '698fbafa9174e67f74e646c57b45dac480062ca241f68c606915d1503adeeb35', '2026-05-29 13:21:29.668175+00', '20260529132129_add_saved_product', NULL, NULL, '2026-05-29 13:21:29.557863+00', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('98f6966c-0734-43d2-b40c-2a41ce707f77', '61a2361391916af49585d93b7b62ee493291e6a702a97eaa12c14f16fa84a145', '2026-05-29 14:54:00.809876+00', '20260529145400_add_subscriber', NULL, NULL, '2026-05-29 14:54:00.788377+00', 1);


--
-- PostgreSQL database dump complete
--

\unrestrict EBCE0JArLpDCue2dvcsgTq1X2kaYmMBr0q0AGUXFyfg1PoaG696dmZ4GAJG0tg6

