<?
require_once "./contact_data.php";
foreach ($contacts as $kpoint=>$vdata){
	?>
<!-- малый блок начало -->
		<table width="215" border="0" cellspacing="0" cellpadding="0">
		  <tr>
			<td width="6" height="6" background="images/ramka_31.gif"></td>
			<td width="202" height="6" background="images/ramka_32.gif"></td>
			<td width="7" height="6" background="images/ramka_34.gif"></td>
		  </tr>
		  <tr>
			<td width="6" background="images/ramka_40.gif"></td>
			<td width="202" valign="top">
			<!-- содержание блока начало -->
			<a name="begovaja"></a><p align="center"><b><? echo $vdata['header'];?></B><br><br>
			 <? echo $vdata['point'];?><br><? echo $vdata['address'];?><br><br> <font color="#ff0000"><strong><? echo $vdata['phone'];?></strong></font> <br/>
			 <noindex><a href="mailto:<? echo $vdata['email'];?>" target="_parent" class="standlink"><? echo $vdata['email'];?></a><br><br></noindex></p>
			<!-- содержание блока конец -->	</td>
			<td width="7" background="images/ramka_43.gif"></td>
		  </tr>
		  <tr>
			<td width="6" height="6" background="images/ramka_58.gif"></td>
			<td width="202" height="6" background="images/ramka_59.gif"></td>
			<td width="7" height="6" background="images/ramka_61.gif"></td>
		  </tr>
		</table>
<!-- малый блок конец -->
<br>
	<?
}
?>

