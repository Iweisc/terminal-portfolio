<script>
  import { theme } from '../stores/theme';
  import { username } from '../stores/username';
  import { currentDirectory } from '../stores/filesystem';
</script>

<h1 class="font-bold flex whitespace-nowrap">
  <span style={`color: ${$theme.yellow};`}>{$username}</span>
  <span style={`color: ${$theme.white}`}>@</span>
  <span style={`color: ${$theme.green}`}>zedpholio</span>
  <span style={`color: ${$theme.white}`}>:{$currentDirectory}$</span>
</h1>
