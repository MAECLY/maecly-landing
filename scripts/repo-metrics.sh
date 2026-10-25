#!/bin/zsh
# Prints reach metrics for every public MAECLY repository: GitHub Traffic
# (views and clones over the last 14 days, visible only to admins), stars and
# total release downloads. Needs `gh` signed in with push access to MAECLY.
set -e
ORG=MAECLY

printf "%-30s %7s %7s %7s %7s %6s %9s\n" repo views uniq clones uniq stars downloads
for r in $(gh repo list $ORG --visibility public --limit 100 --json name --jq '.[].name' | sort); do
  v=$(gh api repos/$ORG/$r/traffic/views --jq '"\(.count) \(.uniques)"' 2>/dev/null || echo "- -")
  c=$(gh api repos/$ORG/$r/traffic/clones --jq '"\(.count) \(.uniques)"' 2>/dev/null || echo "- -")
  s=$(gh api repos/$ORG/$r --jq .stargazers_count)
  d=$(gh api --paginate repos/$ORG/$r/releases --jq '.[].assets[].download_count' | awk '{n+=$1} END {print n+0}')
  printf "%-30s %7s %7s %7s %7s %6s %9s\n" $r ${=v} ${=c} $s $d
done
echo
echo "README view counters (all time, from the badges): https://hits.sh/github.com/$ORG/<repo>/"
