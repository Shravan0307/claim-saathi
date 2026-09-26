<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the hackathon case and task state in a browser-local demo layer, not a backend, because this prototype must remain immediately demonstrable without authentication or external integrations.
- Give each major workspace section its own TanStack route, while sharing one case context, so navigation and page metadata stay coherent.
