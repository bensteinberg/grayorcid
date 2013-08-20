<?php

$mask = gmp_init("562949953421312", 10);

$sans_hyphens = str_replace(array('-'), '', $_GET['orcid']);
$orcid_base = substr($sans_hyphens, 0, 15);
$orcid_base = gmp_init($orcid_base, 10);
$output = array();
$output[] = get_person($_GET['orcid']);
for ($i = 0 ; $i < 50 ; $i ++) {
  $result = gmp_xor($mask, $orcid_base);
  $string = gmp_strval($result, 10);
  $mask = gmp_div_q($mask, '2');
  $orcid = str_pad($string, 15, '0', STR_PAD_LEFT) . check_digit($string);
  $orcid = substr(chunk_split($orcid, 4, '-'), 0, -1);
  if (is_orcid($orcid)) {
    $temp = get_person($orcid);
    if ($temp) {
      $output[] = $temp;
    }
  }
}

echo(json_encode($output));

function get_person($orcid) {
  $data = file_get_contents("http://orcid.org/" . $orcid);
  $DOM = new DOMDocument;
  $DOM->loadHTML($data);
  $xpath = new DOMXPath($DOM);
  $tags = $xpath->query('//h2[@class="full-name"]');
  foreach ($tags as $tag) {
    if (trim($tag->nodeValue) != '') {
      return array($orcid, trim($tag->nodeValue));
    }
  }
  return Null;
}

function is_orcid($orcid) {
  if ($orcid < '0000-0003-5000-0001' and $orcid > '0000-0001-5000-0007') {
    return 1;
  } else {
    return 0;
  }
}

function check_digit($base) {
  $total = 0;
  for ($i = 0 ; $i < strlen($base) ; $i++) {
    $digit = $base[$i];
    $total = ($total + $digit) * 2;
  }
  $remainder = $total % 11;
  $result = (12 - $remainder) % 11;
  return $result == 10 ? "X" : $result;
}

?>