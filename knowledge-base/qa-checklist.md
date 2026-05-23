# QA Checklist

_Ведёт QA (@role-qa)._

## Перед каждым PR

- [ ] `npm run build` без ошибок
- [ ] `npm run lint` без ошибок
- [ ] Нет секретов в коде (.env в .gitignore)
- [ ] Критерии из `orchestration-queue.md` для задачи выполнены

## Регрессия (MVP)

- [ ] Главная страница открывается
- [ ] Нет console.error в браузере на happy path
